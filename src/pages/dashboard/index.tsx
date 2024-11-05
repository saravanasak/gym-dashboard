import Link from 'next/link';

const Dashboard = () => {
  return (
    <div>
      <h1>Gym Management Dashboard</h1>
      <ul>
        <li><Link href="/dashboard/users">Manage Users</Link></li>
        <li><Link href="/dashboard/plans">Manage Plans</Link></li>
        <li><Link href="/dashboard/equipment">Manage Equipment</Link></li>
        <li><Link href="/dashboard/reports">View Reports</Link></li>
        <li><Link href="/dashboard/payments">Payment History</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
