import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import AdminLayout from '../../../components/AdminLayout';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ViewReports = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [planCount, setPlanCount] = useState<number>(0);
  const [equipmentCount, setEquipmentCount] = useState<number>(0);
  const [paymentCount, setPaymentCount] = useState<number>(0);

  // Fetch count data from the database
  const fetchCounts = async () => {
    try {
      // Fetch users count
      const { count: userCountData } = await supabase
        .from('users')
        .select('*', { count: 'exact' });
      setUserCount(userCountData ?? 0);

      // Fetch plans count
      const { count: planCountData } = await supabase
        .from('plans')
        .select('*', { count: 'exact' });
      setPlanCount(planCountData ?? 0);

      // Fetch equipment count
      const { count: equipmentCountData } = await supabase
        .from('equipment')
        .select('*', { count: 'exact' });
      setEquipmentCount(equipmentCountData ?? 0);

      // Fetch payments count
      const { count: paymentCountData } = await supabase
        .from('payments')
        .select('*', { count: 'exact' });
      setPaymentCount(paymentCountData ?? 0);

    } catch (error) {
      console.error("Error fetching report counts:", error);
    }
  };

  // Fetch counts when the component loads
  useEffect(() => {
    fetchCounts();
  }, []);

  const pieData = {
    labels: ['Users', 'Plans', 'Equipment', 'Payments'],
    datasets: [
      {
        label: 'Counts',
        data: [userCount, planCount, equipmentCount, paymentCount],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
        hoverBackgroundColor: ['#2980b9', '#27ae60', '#f39c12', '#c0392b'],
      },
    ],
  };

  const barData = {
    labels: ['Users', 'Plans', 'Equipment', 'Payments'],
    datasets: [
      {
        label: 'Counts',
        data: [userCount, planCount, equipmentCount, paymentCount],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="flex-grow p-6 bg-gray-100 min-h-screen font-sans">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">View Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="border rounded-lg p-4 bg-white shadow-md">
            <p className="text-lg font-semibold text-gray-800">Total Users</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{userCount}</p>
          </div>
          <div className="border rounded-lg p-4 bg-white shadow-md">
            <p className="text-lg font-semibold text-gray-800">Total Plans</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{planCount}</p>
          </div>
          <div className="border rounded-lg p-4 bg-white shadow-md">
            <p className="text-lg font-semibold text-gray-800">Total Equipment</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{equipmentCount}</p>
          </div>
          <div className="border rounded-lg p-4 bg-white shadow-md">
            <p className="text-lg font-semibold text-gray-800">Total Payments</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{paymentCount}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Summary Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md h-72">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Counts Overview (Pie Chart)</h3>
              <div className="h-60">
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md h-72">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Counts Overview (Bar Chart)</h3>
              <div className="h-60">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewReports;
