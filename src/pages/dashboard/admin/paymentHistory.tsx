import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

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
    const { data: usersData } = await supabase.from('users').select('*');
    const { data: plansData } = await supabase.from('plans').select('*');

    if (usersData) setUsers(usersData);
    if (plansData) setPlans(plansData);
  };

  // Fetch payments, users, and plans when the component loads
  useEffect(() => {
    fetchPayments();
    fetchUsersAndPlans();
  }, []);

  // Handle adding new payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a new unique transaction ID
    const newTransactionId = `PAID${String(payments.length + 1).padStart(2, '0')}`;

    const { error } = await supabase.from('payments').insert([
      {
        transaction_id: newTransactionId, // Include transaction ID when adding a payment
        user_id: userId,
        plan_id: planId,
        amount: parseFloat(amount as string),
        date: paymentDate,
      },
    ]);

    if (error) {
      console.error("Error adding payment:", error);
      setMessage("Error: Could not add payment.");
    } else {
      setMessage("Payment added successfully!");
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

  return (
    <div style={{ padding: "20px", fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Payment History</h1>

      {message && (
        <div
          style={{
            color: message.startsWith("Error") ? "red" : "green",
            border: "1px solid",
            borderRadius: "4px",
            padding: "10px",
            marginTop: "10px",
            maxWidth: "300px",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: message.startsWith("Error") ? "#ffe6e6" : "#e6ffe6",
            margin: 'auto',
          }}
        >
          {message}
        </div>
      )}

      {/* Form for adding new payment */}
      <form onSubmit={handleAddPayment} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: "40px",
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: 'auto',
      }}>
        <input
          type="text"
          placeholder="Search User by Name"
          onChange={handleUserSearch}
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />
        
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
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
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
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
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />

        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Add Payment
        </button>
      </form>

      {/* Display the list of payments */}
      <div style={{ marginTop: "20px", maxWidth: "800px", margin: 'auto' }}>
        {payments.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>No payments available.</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                margin: "20px 0",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                backgroundColor: '#fff',
              }}
            >
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}><strong>Transaction ID:</strong> {payment.transaction_id}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}><strong>User Name:</strong> {users.find(user => user.id === payment.user_id)?.name}</p>
              <p style={{ fontSize: '16px', margin: '5px 0' }}><strong>User Member ID:</strong> {users.find(user => user.id === payment.user_id)?.member_id}</p>
              <p style={{ fontSize: '16px', margin: '5px 0' }}><strong>Plan ID:</strong> {plans.find(plan => plan.id === payment.plan_id)?.plan_id}</p>
              <p style={{ fontSize: '16px', margin: '5px 0' }}><strong>Amount:</strong> ${payment.amount}</p>
              <p style={{ fontSize: '16px', margin: '5px 0' }}><strong>Date:</strong> {payment.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
