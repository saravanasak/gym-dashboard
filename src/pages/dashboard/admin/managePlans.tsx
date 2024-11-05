import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

const ManagePlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editPlanId, setEditPlanId] = useState<number | null>(null);
  const [planName, setPlanName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [status, setStatus] = useState('active');

  // Fetch plans from the database
  const fetchPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) {
      console.error("Error fetching plans:", error);
    } else {
      setPlans(data);
    }
  };

  // Fetch plans when the component loads
  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle adding a new plan
  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a new plan ID, like SUB01, SUB02, etc.
    const newPlanId = `SUB${String(plans.length + 1).padStart(2, '0')}`;

    const { error } = await supabase.from('plans').insert([
      {
        plan_id: newPlanId,
        name: planName,
        duration,
        price: parseFloat(price as string),
        status,
      },
    ]);

    if (error) {
      console.error("Error adding plan:", error);
      setMessage("Error: Could not add plan.");
    } else {
      setMessage("Plan added successfully!");
      await fetchPlans(); // Refresh plan list after adding
      setPlanName('');
      setDuration('');
      setPrice('');
      setStatus('active');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle deleting a plan
  const handleDeletePlan = async (planId: number) => {
    const { error } = await supabase.from('plans').delete().eq('id', planId);

    if (error) {
      console.error("Error deleting plan:", error);
      setMessage("Error: Could not delete plan.");
    } else {
      setMessage("Plan deleted successfully!");
      await fetchPlans(); // Refresh plan list after deleting
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle editing a plan
  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('plans')
      .update({ name: planName, duration, price: parseFloat(price as string), status })
      .eq('id', editPlanId);

    if (error) {
      console.error("Error updating plan:", error);
      setMessage("Error: Could not update plan.");
    } else {
      setMessage("Plan updated successfully!");
      await fetchPlans(); // Refresh plan list after editing
      setEditPlanId(null);
      setPlanName('');
      setDuration('');
      setPrice('');
      setStatus('active');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle clicking "Edit" button
  const handleEditClick = (plan: any) => {
    setEditPlanId(plan.id);
    setPlanName(plan.name);
    setDuration(plan.duration);
    setPrice(plan.price);
    setStatus(plan.status);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Plans</h1>

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

      {/* Form for adding or editing plans */}
      <form onSubmit={editPlanId ? handleEditPlan : handleAddPlan} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Plan Name"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Duration (e.g., 1 Month)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
       <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select> 
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
          }}
        >
          {editPlanId ? "Update Plan" : "Add Plan"}
        </button>
      </form>

      {/* Display the list of plans */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              margin: "10px",
              maxWidth: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Plan ID:</strong> {plan.plan_id}</p>
            <p><strong>Plan Name:</strong> {plan.name}</p>
            <p><strong>Duration:</strong> {plan.duration}</p>
            <p><strong>Price:</strong> ${plan.price}</p>
            <p><strong>Status:</strong> {plan.status}</p>

            {/* Edit and Delete buttons */}
            <button
              onClick={() => handleEditClick(plan)}
              style={{
                padding: "8px 15px",
                marginRight: "10px",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeletePlan(plan.id)}
              style={{
                padding: "8px 15px",
                cursor: "pointer",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlans;
