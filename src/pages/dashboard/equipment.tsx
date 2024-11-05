import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const ManageEquipment = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Tracks if we're in editing mode
  const [currentEquipmentId, setCurrentEquipmentId] = useState<number | null>(null); // Stores the ID of the equipment being edited

  // Fetches all equipment from the database
  const fetchEquipment = async () => {
    const { data, error } = await supabase.from('equipment').select('*');
    if (error) {
      console.error("Error fetching equipment:", error);
    } else {
      setEquipment(data); // Updates the state with fetched equipment
    }
  };

  // Initial fetch of equipment when component loads
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Handles adding or updating equipment
  const handleAddOrUpdateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && currentEquipmentId) {
      // Update existing equipment
      const { data, error } = await supabase
        .from('equipment')
        .update({ name, type, status })
        .eq('id', currentEquipmentId);

      if (error) {
        console.error("Error updating equipment:", error);
        setMessage("Error: Could not update equipment.");
      } else {
        setMessage("Equipment updated successfully!");
        setIsEditing(false);
        setCurrentEquipmentId(null);
        setName('');
        setType('');
        setStatus('');
        await fetchEquipment(); // Refresh the equipment list after updating
      }
    } else {
      // Add new equipment
      const { data, error } = await supabase.from('equipment').insert([{ name, type, status }]);

      if (error) {
        console.error("Error adding equipment:", error);
        setMessage("Error: Could not add equipment.");
      } else {
        setMessage("Equipment added successfully!");
        setName('');
        setType('');
        setStatus('');
        await fetchEquipment(); // Refresh the equipment list after adding
      }
    }

    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  // Prepares the form for editing a specific equipment item
  const handleEditEquipment = (item: any) => {
    setIsEditing(true);
    setCurrentEquipmentId(item.id);
    setName(item.name);
    setType(item.type);
    setStatus(item.status);
  };

  // Deletes a specific equipment item from the database
  const handleDeleteEquipment = async (id: number) => {
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) {
      console.error("Error deleting equipment:", error);
      setMessage("Error: Could not delete equipment.");
    } else {
      setMessage("Equipment deleted successfully!");
      await fetchEquipment(); // Refresh the equipment list after deleting
    }

    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div>
      <h1>Manage Equipment</h1>

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

      {/* Form to add or edit equipment */}
      <form onSubmit={handleAddOrUpdateEquipment}>
        <input
          type="text"
          placeholder="Equipment Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type (e.g., Cardio, Strength)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Status (e.g., Available, Maintenance)"
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
          {isEditing ? "Update Equipment" : "Add Equipment"}
        </button>
      </form>

      {/* Display the list of equipment */}
      <ul style={{ marginTop: "20px" }}>
        {equipment.map((item) => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            {item.name} - {item.type} - {item.status}
            <button onClick={() => handleEditEquipment(item)} style={{ marginLeft: "10px", cursor: "pointer" }}>
              Edit
            </button>
            <button onClick={() => handleDeleteEquipment(item.id)} style={{ marginLeft: "10px", cursor: "pointer", color: "red" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEquipment;
