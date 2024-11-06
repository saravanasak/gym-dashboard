import Link from 'next/link';
import { useState } from 'react';
import { FaUsers, FaClipboardList, FaDumbbell, FaChartBar, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import { MdMenu, MdClose } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="flex-grow p-8 bg-white shadow-md">
        <h1 className="text-2xl text-gray-800 mb-4">Welcome to the Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Here you can manage users, subscription plans, equipment, and view reports for the gym.</p>
        
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
