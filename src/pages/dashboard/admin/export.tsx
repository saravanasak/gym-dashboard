// src/pages/dashboard/admin/export.tsx
import AdminLayout from '../../../components/AdminLayout';
import { Button } from '@/components/button';
import { supabase } from '../../../../lib/supabaseClient';
import { useState } from 'react';

const ExportData = () => {
  const [message, setMessage] = useState<string | null>(null);

  const exportTableToCSV = async (tableName: string) => {
    if (!tableName) {
      setMessage('Please select a table to export.');
      return;
    }
    setMessage('Exporting data, please wait...');
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        throw error;
      }
      if (data) {
        const csvContent = convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableName}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage(`Data from ${tableName} exported successfully.`);
      }
    } catch (err) {
      setMessage('Error exporting data. Please try again.');
      console.error('Error exporting data:', err);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(',')];
    data.forEach((row) => {
      const values = keys.map((key) => {
        const value = row[key];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    });
    return csvRows.join('\n');
  };

  return (
    <AdminLayout>
      <div className="flex-grow p-10 bg-gray-100 min-h-screen font-sans flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Export Data</h1>
        <p className="mb-4 text-lg text-gray-700">
          You can export data from various tables in Supabase as CSV files. Select the data you wish to export below:
        </p>
        <div className="flex flex-col space-y-4 w-96">
          <Button onClick={() => exportTableToCSV('users')} className="bg-blue-500 text-white w-full py-2">Export Users Data</Button>
          <Button onClick={() => exportTableToCSV('payments')} className="bg-green-500 text-white w-full py-2">Export Payment History</Button>
          <Button onClick={() => exportTableToCSV('plans')} className="bg-yellow-500 text-white w-full py-2">Export Subscription Plans</Button>
          <Button onClick={() => exportTableToCSV('equipment')} className="bg-red-500 text-white w-full py-2">Export Gym Equipment</Button>
        </div>
        {message && (
          <div className={`p-4 rounded-md text-center font-bold mt-6 ${
            message.startsWith('Error')
              ? 'bg-red-100 text-red-600 border border-red-400'
              : 'bg-green-100 text-green-600 border border-green-400'
          }`}>
            {message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ExportData;
