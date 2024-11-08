import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
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

    try {
      // Check if username, email, or mobile number already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .or(
          `name.eq.${username.toLowerCase()},email.eq.${email.toLowerCase()},mobile_number.eq.${mobileNumber}`
        );

      if (existingUserError) {
        throw existingUserError;
      }

      if (existingUser && existingUser.length > 0) {
        setMessage(
          "Error: Username, email, or mobile number already exists. Please choose a different one."
        );
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
          mobile_number: mobileNumber,
          email: email.toLowerCase(),
          address: address,
        },
      ]);

      if (error) {
        throw error;
      } else {
        setMessage("User created successfully! You can now log in.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Error: Could not create user.");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            {/* Placeholder for an icon or logo */}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign Up for Ironman Fitness Studio
          </h2>
        </div>
        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          {message && (
            <div className="mb-4 p-3 text-center font-bold rounded-md text-red-700 bg-red-100">
              {message}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="username" className="sr-only">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <Label htmlFor="mobileNumber" className="sr-only">
                Mobile Number
              </Label>
              <Input
                type="text"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Mobile Number"
              />
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <Label htmlFor="address" className="sr-only">
                Address
              </Label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Address"
              ></textarea>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

