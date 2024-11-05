import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const PaymentHistory = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Fetch payment records from the database
  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*, users(name), plans(name)');
    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data); // Update state with fetched payments
    }
  };

  // Fetch users and plans for selection in the form
  const fetchUsersAndPlans = async () => {
    const { data: usersData } = await supabase.from('users').select('id, name');
    const { data: plansData } = await supabase.from('plans').select('id, name');
    setUsers(usersData || []);
    setPlans(plansData || []);
  };

  useEffect(() => {
    fetchPayments();
    fetchUsersAndPlans();
  }, []);

  // Handle adding a new payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('payments').insert([
      { user_id: userId, plan_id: planId, amount, date },
    ]);

    if (error) {
      console.error("Error adding payment:", error);
      setMessage("Error: Could not add payment.");
    } else {
      setMessage("Payment added successfully!");
      setUserId('');
      setPlanId('');
      setAmount('');
      setDate('');
      await fetchPayments(); // Refresh payment list after adding
    }

    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div>
      <h1>Payment History</h1>

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
          }}
        >
          {message}
        </div>
      )}

      {/* Form to add a new payment */}
      <form onSubmit={handleAddPayment}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <select value={planId} onChange={(e) => setPlanId(e.target.value)} required>
          <option value="">Select Plan</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}>
          Add Payment
        </button>
      </form>

      {/* Display the list of payments */}
      <ul style={{ marginTop: "20px" }}>
        {payments.map((payment) => (
          <li key={payment.id} style={{ marginBottom: "8px" }}>
            User: {payment.users.name} | Plan: {payment.plans.name} | Amount: ${payment.amount} | Date: {payment.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;
