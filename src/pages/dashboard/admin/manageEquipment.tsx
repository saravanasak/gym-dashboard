import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

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
    <div style={{ padding: "20px" }}>
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

      {/* Form for adding or editing equipment */}
      <form onSubmit={editEquipmentId ? handleEditEquipment : handleAddEquipment} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Equipment Name"
          value={equipmentName}
          onChange={(e) => setEquipmentName(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Equipment Type"
          value={equipmentType}
          onChange={(e) => setEquipmentType(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="Available">Available</option>
          <option value="Not available">Not available</option>
          <option value="Discarded">Discarded</option>
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
          {editEquipmentId ? "Update Equipment" : "Add Equipment"}
        </button>
      </form>

      {/* Display the list of equipment */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {equipment.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              margin: "10px",
              maxWidth: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Equipment Name:</strong> {item.name}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Status:</strong> {item.status}</p>

            {/* Edit and Delete buttons */}
            <button
              onClick={() => handleEditClick(item)}
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
              onClick={() => handleDeleteEquipment(item.id)}
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

export default ManageEquipment;
