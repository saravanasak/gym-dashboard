import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>View Reports</h1>
      <div style={{ marginTop: "20px", maxWidth: "600px" }}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            margin: "10px 0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p><strong>Total Users:</strong> {userCount}</p>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            margin: "10px 0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p><strong>Total Plans:</strong> {planCount}</p>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            margin: "10px 0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p><strong>Total Equipment:</strong> {equipmentCount}</p>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            margin: "10px 0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p><strong>Total Payments:</strong> {paymentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
