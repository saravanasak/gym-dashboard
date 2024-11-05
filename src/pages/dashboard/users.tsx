import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]); // State to hold list of users
  const [name, setName] = useState(''); // State to hold new user's name
  const [status, setStatus] = useState(''); // State to hold new user's status
  const [message, setMessage] = useState<string | null>(null); // State to hold the success/error message
  const [isAdding, setIsAdding] = useState(false); // State to handle loading and disable button

  // Function to fetch users from the database
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
  };

  // Initial fetch of users when component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle form submission and add new user to the database
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from reloading on form submission

    // Set loading state and disable the button
    setIsAdding(true);

    // Check if user already exists in the database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('name', name.toLowerCase());

    if (checkError) {
      console.error("Error checking for duplicates:", checkError);
      setMessage("Error: Could not check for duplicates.");
      setTimeout(() => setMessage(null), 3000);
      setIsAdding(false);
      return;
    }

    if (existingUser && existingUser.length > 0) {
      setMessage("Error: User with this name already exists.");
      setTimeout(() => setMessage(null), 3000);
      setIsAdding(false);
      return;
    }

    // Insert a new user into the 'users' table
    const { data, error } = await supabase.from('users').insert([{ name, status }]);

    if (error) {
      console.error("Error adding user:", error);
      setMessage("Error: Could not add user.");
    } else {
      setMessage("User added successfully!");
      setName(''); // Clear the input fields
      setStatus('');
      
      // Fetch the updated list of users after adding a new user
      await fetchUsers();
    }

    // Reset loading state and clear the message after 3 seconds
    setIsAdding(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h1>Manage Users</h1>
      
      {/* Display success or error message */}
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

      {/* Form to add a new user */}
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            cursor: isAdding ? "not-allowed" : "pointer",
            backgroundColor: isAdding ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
          disabled={isAdding} // Disable button while adding
        >
          {isAdding ? "Adding..." : "Add User"}
        </button>
      </form>

      {/* Display the list of users */}
      <ul style={{ marginTop: "20px" }}>
        {users.map((user, index) => {
          if (!user || !user.name || !user.status) {
            console.log("Invalid user at index:", index, user); // Log any invalid user
            return null; // Skip rendering this item if user is null or invalid
          }

          return (
            <li key={user.id} style={{ marginBottom: "8px" }}>
              {user.name} - {user.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ManageUsers;
