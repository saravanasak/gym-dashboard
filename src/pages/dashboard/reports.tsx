import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const Reports = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalActivePlans, setTotalActivePlans] = useState<number | null>(null);
  const [totalEquipment, setTotalEquipment] = useState<number | null>(null);

  // Fetch the total number of users
  const fetchTotalUsers = async () => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact' });
    if (error) {
      console.error("Error fetching total users:", error);
    } else {
      setTotalUsers(count);
    }
  };

  // Fetch the total number of active plans
  const fetchTotalActivePlans = async () => {
    const { count, error } = await supabase
      .from('plans')
      .select('*', { count: 'exact' })
      .eq('status', 'active'); // Only count plans where status is 'active'
    if (error) {
      console.error("Error fetching active plans:", error);
    } else {
      setTotalActivePlans(count);
    }
  };

  // Fetch the total number of equipment items
  const fetchTotalEquipment = async () => {
    const { count, error } = await supabase
      .from('equipment')
      .select('*', { count: 'exact' });
    if (error) {
      console.error("Error fetching total equipment:", error);
    } else {
      setTotalEquipment(count);
    }
  };

  // Fetch all data when the component loads
  useEffect(() => {
    fetchTotalUsers();
    fetchTotalActivePlans();
    fetchTotalEquipment();
  }, []);

  return (
    <div>
      <h1>Reports</h1>
      <div style={{ marginTop: "20px" }}>
        <p><strong>Total Users:</strong> {totalUsers !== null ? totalUsers : 'Loading...'}</p>
        <p><strong>Total Active Plans:</strong> {totalActivePlans !== null ? totalActivePlans : 'Loading...'}</p>
        <p><strong>Total Equipment:</strong> {totalEquipment !== null ? totalEquipment : 'Loading...'}</p>
      </div>
    </div>
  );
};

export default Reports;
