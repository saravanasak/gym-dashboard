// src/pages/dashboard/admin/index.tsx
import AdminLayout from '../../../components/AdminLayout';
import Image from 'next/image';

const AdminIndex = () => {
  return (
    <AdminLayout>
      <div className="flex-grow p-10 bg-gray-100 min-h-screen font-sans flex flex-col items-center">
        <div className="text-center">
          <Image src="$1" alt="$2" width={384} height={384} className="$3" />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Welcome to the Admin Dashboard</h1>
          <p className="text-xl text-gray-800 mb-8">Manage users, subscription plans, gym equipment, payments, and view important reports. The Admin Dashboard provides all the necessary tools for smooth gym management.</p>
          <p className="mt-4 text-lg text-gray-600">33/6, Pallavaram - Kundrathur Rd, Andan Kuppam, Kundrathur, Chennai, Kolathuvancheri, Tamil Nadu 600069</p>
        </div>
      </div>
      <footer className="w-full text-center p-4 bg-gray-800 text-gray-200">
        <p>Developed by Excham | <a href="mailto:contact@excham.com" className="underline text-yellow-400">contact@excham.com</a></p>
      </footer>
    </AdminLayout>
  );
};

export default AdminIndex;
