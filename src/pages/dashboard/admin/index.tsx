import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link href="/dashboard/admin/manageUsers">Manage Users</Link></li>
        <li><Link href="/dashboard/admin/managePlans">Manage Plans</Link></li>
        <li><Link href="/dashboard/admin/manageEquipment">Manage Equipment</Link></li>
        <li><Link href="/dashboard/admin/viewReports">View Reports</Link></li>
        <li><Link href="/dashboard/admin/paymentHistory">Payment History</Link></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
