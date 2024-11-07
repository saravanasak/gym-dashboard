import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { supabase } from '../../../../lib/supabaseClient';

type Payment = {
  transaction_id: string;
  user_id: string;
  expiry_date: string;
  amount: number;
  plan_id: string;
  date: string;
  users: {
    name: string;
    member_id: string;
  };
  plans: {
    name: string;
  };
};

type Notification = {
  title: string;
  message: {
    memberId: string;
    username: string;
    planId: string;
    amountPaid: string;
    paymentDate: string;
    transactionId: string;
    expiryDate: string;
  };
  created_at: string;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch payments with expiry dates within the current month
  const fetchNotifications = async () => {
    setLoading(true);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const firstDayOfMonthISO = firstDayOfMonth.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const lastDayOfMonthISO = lastDayOfMonth.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          transaction_id,
          user_id,
          expiry_date,
          amount,
          date,
          plan_id,
          users (
            name,
            member_id
          ),
          plans (
            name
          )
        `)
        .gte('expiry_date', firstDayOfMonthISO)
        .lte('expiry_date', lastDayOfMonthISO)
        .order('expiry_date', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && Array.isArray(data)) {
        const upcomingExpirations = data.map((payment: any) => {
          const user = payment.users;
          const plan = payment.plans;

          return {
            title: 'Membership Plan Expiry Reminder',
            message: {
              memberId: user?.member_id || 'N/A',
              username: user?.name || 'N/A',
              planId: plan?.name || 'N/A',
              amountPaid: `₹${payment.amount || 'N/A'}`,
              paymentDate: payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A',
              transactionId: payment.transaction_id || 'N/A',
              expiryDate: payment.expiry_date ? new Date(payment.expiry_date).toLocaleDateString() : 'N/A',
            },
            created_at: new Date().toISOString(),
          };
        });

        setNotifications(upcomingExpirations);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter((notification) => {
    const { memberId, username } = notification.message;
    return (
      memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="flex-grow p-8 bg-gray-100 min-h-screen font-sans flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Notifications</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md flex mb-6">
          <input
            type="text"
            placeholder="Search by Member ID or Username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border-t border-b border-l rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white font-bold rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-lg font-semibold text-gray-600">Loading notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-lg font-semibold text-gray-600">No memberships expiring this month.</p>
        ) : (
          <div className="w-full max-w-3xl space-y-4">
            {filteredNotifications.map((notification, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 bg-white shadow-sm transform transition-all duration-300 ease-in-out hover:shadow-md hover:scale-105"
              >
                <p className="font-semibold text-xl text-center mb-4 text-blue-800">{notification.title}</p>
                <div className="text-lg text-gray-800 space-y-2">
                  <p>
                    <span className="font-semibold">Member ID:</span> <span className="text-red-600">{notification.message.memberId}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Username:</span> {notification.message.username}
                  </p>
                  <p>
                    <span className="font-semibold">Plan ID:</span> {notification.message.planId}
                  </p>
                  <p>
                    <span className="font-semibold">Last Amount Paid:</span> {notification.message.amountPaid}
                  </p>
                  <p>
                    <span className="font-semibold">Last Payment Date:</span> {notification.message.paymentDate}
                  </p>
                  <p>
                    <span className="font-semibold">Transaction ID:</span> {notification.message.transactionId}
                  </p>
                  <p>
                    <span className="font-semibold">Expiry Date:</span> <span className="text-red-600">{notification.message.expiryDate}</span>
                  </p>
                </div>
                <p className="text-gray-500 text-sm text-center mt-4">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Notifications;
