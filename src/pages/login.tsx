import { useState } from 'react';
import { supabase } from './../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Handle user login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Fetch the user from the database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', username.toLowerCase())
        .single();

      if (error || !user) {
        console.error("Error fetching user:", error);
        setMessage("Error: Invalid username or password.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Step 2: Compare the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        setMessage("Error: Invalid username or password.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Step 3: Redirect based on user role
      switch (user.role) {
        case 'admin':
          await router.push('/dashboard/admin');
          break;
        case 'staff':
          await router.push('/dashboard/staff');
          break;
        case 'customer':
          await router.push('/dashboard/customer');
          break;
        default:
          setMessage("Error: Unknown user role.");
          setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("Error: An unexpected error occurred. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Login</h1>

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

      {/* Form for user login */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
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
            width: "100%",
            fontWeight: "bold",
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
