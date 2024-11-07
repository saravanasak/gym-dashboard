import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import AdminLayout from '../../../components/AdminLayout';

const PaymentHistory = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | string>('');
  const [planId, setPlanId] = useState<number | string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);

  // Fetch payments, users, and plans from the database
  const fetchPayments = async () => {
    const { data, error } = await supabase.from('payments').select('*').order('id', { ascending: false });
    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data);
    }
  };

  const fetchUsersAndPlans = async () => {
    const { data: usersData } = await supabase.from('users').select('id, name, member_id, mobile_number');
    const { data: plansData } = await supabase.from('plans').select('*');

    if (usersData) setUsers(usersData);
    if (plansData) setPlans(plansData);
  };

  // Fetch payments, users, and plans when the component loads
  useEffect(() => {
    fetchPayments();
    fetchUsersAndPlans();
  }, []);

  // Function to calculate expiry date
  function calculateExpiryDate(durationInMonths: number, paymentDate: string): string {
    if (!paymentDate) {
      console.error("Payment date is not provided");
      return "";
    }
    const paymentDateObj = new Date(paymentDate);
    paymentDateObj.setMonth(paymentDateObj.getMonth() + durationInMonths);
    return paymentDateObj.toISOString().split('T')[0]; // Format date as YYYY-MM-DD for database
  }

  // Handle adding new payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find the selected plan and get its duration
    const selectedPlan = plans.find(plan => plan.id == planId);
    if (!selectedPlan) {
      setMessage("Error: Could not find the selected plan.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Calculate the expiry date based on the plan duration
    const planDuration = parseInt(selectedPlan.duration, 10); // Ensure duration is a number
    const expiryDate = calculateExpiryDate(planDuration, paymentDate);

    console.log("Calculated Expiry Date: ", expiryDate); // Debugging log for expiry date

    // Fetch the latest transaction ID from all payments to determine the next ID
    const { data: allPayments, error: fetchError } = await supabase.from('payments').select('transaction_id').order('id', { ascending: false });
    if (fetchError) {
      console.error("Error fetching all payments:", fetchError);
      setMessage("Error: Could not determine the next transaction ID.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Calculate new transaction ID
    let newTransactionId = 'PAID01';
    if (allPayments && allPayments.length > 0) {
      // Extract the numeric part of the highest transaction ID and increment it
      const lastTransaction = allPayments[0];
      const lastTransactionNumber = parseInt(lastTransaction.transaction_id.replace('PAID', ''), 10);
      newTransactionId = `PAID${String(lastTransactionNumber + 1).padStart(2, '0')}`;
    }

    // Insert new payment
    const { error: insertError } = await supabase.from('payments').insert([
      {
        transaction_id: newTransactionId,
        user_id: userId,
        plan_id: planId,
        amount: parseFloat(amount as string),
        date: paymentDate,
        expiry_date: expiryDate,
      },
    ]);

    if (insertError) {
      console.error("Error adding payment:", insertError);
      setMessage("Error: Could not add payment.");
    } else {
      setMessage(`Payment added successfully! Expiry Date: ${expiryDate}`);
      await fetchPayments(); // Refresh payment list after adding
      setUserId('');
      setPlanId('');
      setAmount('');
      setPaymentDate('');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Filter users based on search input
  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(searchTerm)));
    setUserId(''); // Reset userId until a user is selected
  };

  // Filter payments based on search input
  const handlePaymentSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or(`transaction_id.ilike.%${term}%,user_id.in.(${users.filter(user => user.name.toLowerCase().includes(term.toLowerCase())).map(user => user.id)})`);
      if (!error) {
        setFilteredPayments(data);
      }
    } else {
      setFilteredPayments([]);
    }
  };

  const generateWhatsAppLink = (userName: any, userMobileNumber: any, transactionId: any, amount: any, paymentDate: any, expiryDate: any) => {
    const message = `Hello ${userName ?? ''},\n\nThank you for visiting Iornman Fitness Studio.\n\nHere are your payment details:\nTransaction ID: ${transactionId ?? ''}\nAmount: ₹${amount ?? ''}\nDate: ${paymentDate ?? ''}\nExpiry Date: ${expiryDate ?? ''}\n\nFeel free to contact us if you have any questions.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${userMobileNumber}?text=${encodedMessage}`;
  };

  return (
    <AdminLayout>
      <div className="flex-grow p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen font-sans">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Payment History</h1>

        {message && (
          <div
            className={`p-4 rounded-md text-center font-bold mb-6 shadow-lg transform transition-all duration-300 ease-in-out ${
              message.startsWith("Error")
                ? "bg-red-100 text-red-600 border border-red-400"
                : "bg-green-100 text-green-600 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Form for adding new payment */}
          <form onSubmit={handleAddPayment} className="md:w-1/3 space-y-4 bg-white p-8 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Payment</h2>
            <input
              type="text"
              placeholder="Search User by Name"
              onChange={handleUserSearch}
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            >
              <option value="">Select User</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.member_id}
                </option>
              ))}
            </select>

            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            >
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.plan_id}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />

            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />

            <button
              type="submit"
              className="px-10 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 shadow-lg transform hover:scale-105 w-full"
            >
              Add Payment
            </button>
          </form>

          <div className="md:w-2/3 flex flex-col items-center">
            {/* Search bar for payments */}
            <input
              type="text"
              placeholder="Search by Transaction ID or User Name"
              value={searchTerm}
              onChange={handlePaymentSearch}
              className="p-3 border rounded-md w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />

            {/* Display the latest payment or filtered payments */}
            <div className="grid grid-cols-1 gap-6 mt-8 overflow-y-auto max-h-[50vh] w-full">
              {(searchTerm && filteredPayments.length > 0 ? filteredPayments : payments).map((payment) => {
                const user = users.find(user => user.id === payment.user_id);
                const userMobileNumber = user?.mobile_number;
                return (
                  <div
                    key={payment.id}
                    className="border rounded-lg p-6 bg-white shadow-2xl transform transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 text-center"
                  >
                    <p className="font-semibold text-lg mb-2">Transaction ID: {payment.transaction_id}</p>
                    <p className="text-base text-gray-600">User Name: {user?.name}</p>
                    <p className="text-base text-gray-600">User Member ID: {user?.member_id}</p>
                    <p className="text-base text-gray-600">Plan ID: {plans.find(plan => plan.id === payment.plan_id)?.plan_id}</p>
                    <p className="text-lg text-blue-600 font-bold">Amount: ₹{payment.amount}</p>
                    <p className="text-lg text-blue-600 font-bold">Date: {payment.date}</p>
                    <p className="text-base text-gray-600">Expiry Date: {payment.expiry_date}</p>
                    {userMobileNumber && (
                      <a
                        href={generateWhatsAppLink(user.name, userMobileNumber, payment.transaction_id, payment.amount, payment.date, payment.expiry_date)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 mt-4 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transform hover:scale-105"
                      >
                        Send via WhatsApp
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentHistory;
