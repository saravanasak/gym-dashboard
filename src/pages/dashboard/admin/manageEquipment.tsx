import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import AdminLayout from '../../../components/AdminLayout';

const ManageEquipment = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editEquipmentId, setEditEquipmentId] = useState<number | null>(null);
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [quantity, setQuantity] = useState<number | string>('');
  const [status, setStatus] = useState('active');

  // Fetch equipment from the database
  const fetchEquipment = async () => {
    const { data, error } = await supabase.from('equipment').select('*');
    if (error) {
      console.error("Error fetching equipment:", error);
    } else {
      setEquipment(data);
    }
  };

  // Fetch equipment when the component loads
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Handle adding new equipment
  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('equipment').insert([
      {
        name: equipmentName,
        type: equipmentType,
        quantity: parseInt(quantity as string, 10),
        status,
      },
    ]);

    if (error) {
      console.error("Error adding equipment:", error);
      setMessage("Error: Could not add equipment.");
    } else {
      setMessage("Equipment added successfully!");
      await fetchEquipment(); // Refresh equipment list after adding
      setEquipmentName('');
      setEquipmentType('');
      setQuantity('');
      setStatus('active');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle deleting equipment
  const handleDeleteEquipment = async (equipmentId: number) => {
    const { error } = await supabase.from('equipment').delete().eq('id', equipmentId);

    if (error) {
      console.error("Error deleting equipment:", error);
      setMessage("Error: Could not delete equipment.");
    } else {
      setMessage("Equipment deleted successfully!");
      await fetchEquipment(); // Refresh equipment list after deleting
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle editing equipment
  const handleEditEquipment = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('equipment')
      .update({ name: equipmentName, type: equipmentType, quantity: parseInt(quantity as string, 10), status })
      .eq('id', editEquipmentId);

    if (error) {
      console.error("Error updating equipment:", error);
      setMessage("Error: Could not update equipment.");
    } else {
      setMessage("Equipment updated successfully!");
      await fetchEquipment(); // Refresh equipment list after editing
      setEditEquipmentId(null);
      setEquipmentName('');
      setEquipmentType('');
      setQuantity('');
      setStatus('active');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle clicking "Edit" button
  const handleEditClick = (equipment: any) => {
    setEditEquipmentId(equipment.id);
    setEquipmentName(equipment.name);
    setEquipmentType(equipment.type);
    setQuantity(equipment.quantity);
    setStatus(equipment.status);
  };

  return (
    <AdminLayout>
      <div className="flex-grow p-8 bg-gray-100 min-h-screen font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Equipment</h1>

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

        {/* Form for adding or editing equipment */}
        <form onSubmit={editEquipmentId ? handleEditEquipment : handleAddEquipment} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Equipment Name"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Equipment Type"
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="p-2 border rounded-md w-full"
            >
              <option value="Available">Available</option>
              <option value="Not available">Not available</option>
              <option value="Discarded">Discarded</option>
            </select>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              {editEquipmentId ? "Update Equipment" : "Add Equipment"}
            </button>
          </div>
        </form>

        {/* Display the list of equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-6 bg-white shadow-md w-full"
            >
              <p className="font-semibold text-lg">Equipment Name: {item.name}</p>
              <p className="text-gray-600">Type: {item.type}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Status: {item.status}</p>

              {/* Edit and Delete buttons */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEditClick(item)}
                  className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEquipment(item.id)}
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

export default ManageEquipment;
