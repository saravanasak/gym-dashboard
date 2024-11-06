// Logout Page
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push('/'); // Redirect to landing page after logout
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Logging you out...</h1>
    </div>
  );
};

export default Logout;