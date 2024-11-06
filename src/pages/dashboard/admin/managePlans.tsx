import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import AdminLayout from '../../../components/AdminLayout';

const ManagePlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editPlanId, setEditPlanId] = useState<number | null>(null);
  const [planName, setPlanName] = useState('');
  const [duration, setDuration] = useState<number | string>('');
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
        duration: parseInt(duration as string),
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
      .update({ name: planName, duration: parseInt(duration as string), price: parseFloat(price as string), status })
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
    <AdminLayout>
      <div className="flex-grow p-8 bg-gray-100 min-h-screen font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Plans</h1>

        {message && (
          <div
            className={`p-4 rounded-md text-center font-bold mb-6 ${
              message.startsWith("Error")
                ? "bg-red-100 text-red-600 border border-red-400"
                : "bg-green-100 text-green-600 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form for adding or editing plans */}
        <form onSubmit={editPlanId ? handleEditPlan : handleAddPlan} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Plan Name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            />

            <input
              type="number"
              placeholder="Duration in Months"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              required
              className="p-2 border rounded-md w-full"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              {editPlanId ? "Update Plan" : "Add Plan"}
            </button>
          </div>
        </form>

        {/* Display the list of plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 bg-white shadow-md w-full"
            >
              <p className="font-semibold text-lg">Plan ID: {plan.plan_id}</p>
              <p className="text-gray-600">Plan Name: {plan.name}</p>
              <p className="text-gray-600">Duration: {plan.duration}</p>
              <p className="text-gray-600">Price: ${plan.price}</p>
              <p className="text-gray-600">Status: {plan.status}</p>

              {/* View, Edit, and Delete buttons */}
              <div className="mt-4 flex space-x-4">
                <Link href={`/admin/plans/view/${plan.id}`}>
                  <a className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 text-center">
                    View
                  </a>
                </Link>
                <button
                  onClick={() => handleEditClick(plan)}
                  className="w-full px-4 py-2 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePlans;
