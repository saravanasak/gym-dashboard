import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const ManagePlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState(''); // State for plan status
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null); // Track the ID of the plan being edited

  // Fetch plans from the database
  const fetchPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) {
      console.error("Error fetching plans:", error);
    } else {
      setPlans(data); // Update state with fetched plans
    }
  };

  // Initial fetch of plans when component loads
  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle adding or updating a plan
  const handleAddOrUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && currentPlanId) {
      // Update an existing plan
      const { error } = await supabase
        .from('plans')
        .update({ name, duration, price, status })
        .eq('id', currentPlanId);

      if (error) {
        console.error("Error updating plan:", error);
        setMessage("Error: Could not update plan.");
      } else {
        setMessage("Plan updated successfully!");
        setIsEditing(false);
        setCurrentPlanId(null);
        setName('');
        setDuration('');
        setPrice('');
        setStatus('');
        await fetchPlans(); // Refresh the list after updating
      }
    } else {
      // Add a new plan
      const { error } = await supabase.from('plans').insert([{ name, duration, price, status }]);

      if (error) {
        console.error("Error adding plan:", error);
        setMessage("Error: Could not add plan.");
      } else {
        setMessage("Plan added successfully!");
        setName('');
        setDuration('');
        setPrice('');
        setStatus('');
        await fetchPlans(); // Refresh the list after adding
      }
    }

    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  // Prepare the form for editing a specific plan
  const handleEditPlan = (plan: any) => {
    setIsEditing(true);
    setCurrentPlanId(plan.id);
    setName(plan.name);
    setDuration(plan.duration);
    setPrice(plan.price.toString());
    setStatus(plan.status);
  };

  // Delete a specific plan from the database
  const handleDeletePlan = async (id: number) => {
    const { error } = await supabase.from('plans').delete().eq('id', id);
    if (error) {
      console.error("Error deleting plan:", error);
      setMessage("Error: Could not delete plan.");
    } else {
      setMessage("Plan deleted successfully!");
      await fetchPlans(); // Refresh the list after deleting
    }

    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div>
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

      {/* Form to add or edit a plan */}
      <form onSubmit={handleAddOrUpdatePlan}>
        <input
          type="text"
          placeholder="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Duration (e.g., 1 Month)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {/* Text input for the status */}
        <input
          type="text"
          placeholder="Status (e.g., active, inactive)"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            cursor: "pointer",
            backgroundColor: isEditing ? "#FFA500" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isEditing ? "Update Plan" : "Add Plan"}
        </button>
      </form>

      {/* Display the list of plans */}
      <ul style={{ marginTop: "20px" }}>
        {plans.map((plan) => (
          <li key={plan.id} style={{ marginBottom: "8px" }}>
            {plan.name} - {plan.duration} - ${plan.price} - {plan.status}
            <button onClick={() => handleEditPlan(plan)} style={{ marginLeft: "10px", cursor: "pointer" }}>
              Edit
            </button>
            <button onClick={() => handleDeletePlan(plan.id)} style={{ marginLeft: "10px", cursor: "pointer", color: "red" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePlans;
