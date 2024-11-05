import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import bcrypt from 'bcryptjs';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Function to generate the next member ID
  const generateMemberID = async () => {
    // Fetch the latest member ID from the users table
    const { data: users, error } = await supabase
      .from('users')
      .select('member_id')
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching latest member ID:", error);
      return 'MEM01'; // Start from MEM01 if there are no existing users
    }

    if (users.length === 0 || !users[0].member_id) {
      return 'MEM01'; // Start from MEM01 if no users exist
    }

    // Extract the number part from the last member ID and increment it
    const lastMemberID = users[0].member_id;
    const lastNumber = parseInt(lastMemberID.replace('MEM', ''), 10);
    const nextNumber = lastNumber + 1;

    // Format the next member ID (e.g., MEM01, MEM02, MEM03)
    return `MEM${String(nextNumber).padStart(2, '0')}`;
  };

  // Handle user signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('name', username.toLowerCase())
      .single();

    if (existingUser) {
      setMessage("Error: Username already exists. Please choose a different username.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique member ID
    const memberID = await generateMemberID();

    // Insert new user with default role 'customer' and status 'active'
    const { error } = await supabase.from('users').insert([
      {
        name: username.toLowerCase(),
        password: hashedPassword,
        role: 'customer', // Default role as 'customer'
        status: 'active', // Default status as 'active'
        member_id: memberID, // Unique member ID
      },
    ]);

    if (error) {
      console.error("Error creating user:", error);
      setMessage("Error: Could not create user.");
    } else {
      setMessage("User created successfully! You can now log in.");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h1>Signup</h1>

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

      {/* Form for user signup */}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
