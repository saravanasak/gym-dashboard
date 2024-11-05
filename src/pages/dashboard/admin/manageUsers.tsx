import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('customer');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');

  // Fetch users from the database
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
  };

  // Fetch users when the component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle adding a new user
  // Handle adding a new user
const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Step 1: Check if the username already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('name', username.toLowerCase())
      .single();
  
    if (fetchError) {
      console.error("Error fetching user:", fetchError);
    }
  
    if (existingUser) {
      setMessage("Error: Username already exists. Please choose a different username.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  
    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Step 3: Insert the new user
    const { error } = await supabase.from('users').insert([
      {
        name: username.toLowerCase(),
        role,
        status,
        password: hashedPassword,
        member_id: `MEM${String(users.length + 1).padStart(2, '0')}`, // Generate member ID
      },
    ]);
  
    if (error) {
      console.error("Error adding user:", error);
      setMessage("Error: Could not add user.");
    } else {
      setMessage("User added successfully!");
      await fetchUsers(); // Refresh user list after adding
      setUsername('');
      setRole('customer');
      setStatus('active');
      setPassword('');
    }
  
    setTimeout(() => setMessage(null), 3000);
  };
  

  // Handle deleting a user
  const handleDeleteUser = async (userId: number) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
      console.error("Error deleting user:", error);
      setMessage("Error: Could not delete user.");
    } else {
      setMessage("User deleted successfully!");
      await fetchUsers(); // Refresh user list after deleting
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle editing a user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedFields: any = { name: username, role, status };
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const { error } = await supabase
      .from('users')
      .update(updatedFields)
      .eq('id', editUserId);

    if (error) {
      console.error("Error updating user:", error);
      setMessage("Error: Could not update user.");
    } else {
      setMessage("User updated successfully!");
      await fetchUsers(); // Refresh user list after editing
      setEditUserId(null);
      setUsername('');
      setRole('customer');
      setStatus('active');
      setPassword('');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle clicking "Edit" button
  const handleEditClick = (user: any) => {
    setEditUserId(user.id);
    setUsername(user.name);
    setRole(user.role);
    setStatus(user.status);
    setPassword(''); // Clear password field on edit
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Users</h1>

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

      {/* Form for adding or editing users */}
      <form onSubmit={editUserId ? handleEditUser : handleAddUser} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
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
          {editUserId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Display the list of users */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              margin: "10px",
              maxWidth: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Username:</strong> {user.name}</p>
            <p><strong>Member ID:</strong> {user.member_id}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {user.status}</p>

            {/* Edit and Delete buttons */}
            <button
              onClick={() => handleEditClick(user)}
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
              onClick={() => handleDeleteUser(user.id)}
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

export default ManageUsers;
