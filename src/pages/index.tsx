import Link from 'next/link';
import { Button } from "@/components/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            {/* Placeholder for an icon or logo */}
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            Welcome to Ironman Fitness Studio
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Link href="/signup" legacyBehavior>
  <a className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
    Join Us Now
  </a>
</Link>
          </div>
        </div>
        <div className="text-center">
          <Link href="/login" legacyBehavior>
            <a className="font-medium text-yellow-600 hover:text-yellow-500">
              Already have an account? Sign in here
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

