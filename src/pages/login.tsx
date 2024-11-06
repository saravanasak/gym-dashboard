import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
// import { Dumbbell } from "lucide-react"; (commented out due to error)

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch user by username
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', username.toLowerCase())
        .single();

      if (error) {
        setMessage('Invalid username or password.');
        return;
      }

      // Check if user is inactive
      if (user.status === 'inactive') {
        setMessage('Your account is inactive. Please contact the admin to reactivate your account.');
        return;
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        setMessage('Invalid username or password.');
        return;
      }

      // Redirect to respective dashboard based on user role
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'staff') {
        router.push('/dashboard/staff');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            {/* Dumbbell icon removed due to import error */}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Ironman Fitness Studio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Power up your workout
          </p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {message && (
            <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md text-center">
              {message}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="username" className="sr-only">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center">
          <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
