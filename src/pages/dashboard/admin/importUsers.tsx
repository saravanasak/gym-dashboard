// src/pages/dashboard/admin/importUsers.tsx
import { useState, useRef } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import AdminLayout from '../../../components/AdminLayout';
import { Button } from '@/components/button';
import bcrypt from 'bcryptjs';

const ImportUsers = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result as string;
      const rows = data.split('\n').map((row) => row.split(','));
      const keys = rows[0];
      const jsonData = rows.slice(1).map((row) => {
        return row.reduce((acc, value, index) => {
          acc[keys[index]] = value;
          return acc;
        }, {} as Record<string, string>);
      });

      let successCount = 0;
      let failedCount = 0;

      for (const user of jsonData) {
        try {
          if (typeof user !== 'object' || user === null) {
            throw new Error('Invalid user data format');
          }
          const hashedPassword = await bcrypt.hash('defaultPassword123', 10);
          const userWithDefaults = {
            name: user.name,
            email: user.email,
            mobile_number: user.mobile_number,
            address: user.address,
            role: user.role || 'customer',
            password: hashedPassword,
            status: user.status || 'active',
            member_id: await generateMemberID(),
          };
          const { error } = await supabase.from('users').insert(userWithDefaults);
          if (error) {
            failedCount++;
            setMessage((prevMessage) => `${prevMessage ? prevMessage + '\n' : ''}Failed to import user: ${user.name}`);
          } else {
            successCount++;
            setMessage((prevMessage) => `${prevMessage ? prevMessage + '\n' : ''}Successfully imported user: ${user.name}`);
          }
        } catch (err) {
          failedCount++;
          setMessage((prevMessage) => `${prevMessage ? prevMessage + '\n' : ''}Error importing user: ${user.name}`);
        }
      }

      setImportResult({ success: successCount, failed: failedCount });
    };
    reader.readAsText(file);
  };

  const generateMemberID = async () => {
    const { data: users, error } = await supabase
      .from('users')
      .select('member_id')
      .order('id', { ascending: false })
      .limit(1);

    if (error || !users.length) {
      return 'MEM01';
    }

    const lastMemberID = users[0].member_id;
    const lastNumber = parseInt(lastMemberID.replace('MEM', ''), 10);
    const nextNumber = lastNumber + 1;
    return `MEM${String(nextNumber).padStart(2, '0')}`;
  };

  const handleUploadClick = () => {
    if (!fileInputRef.current?.files?.length) {
      setMessage('Please select a file to upload.');
      return;
    }
    setMessage(null);
    handleFileUpload({ target: { files: fileInputRef.current.files } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <AdminLayout>
      <div className="flex-grow p-8 bg-gray-100 min-h-screen font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Import Users</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4 text-lg text-gray-700">
            To import users in bulk, please upload a CSV file (.csv) with the following format. Ensure all columns are filled correctly:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li><strong>name</strong>: Username of the user (e.g., john_doe)</li>
            <li><strong>email</strong>: Email address of the user (e.g., john@example.com)</li>
            <li><strong>mobile_number</strong>: Mobile number of the user (e.g., 1234567890)</li>
            <li><strong>address</strong>: Address of the user (e.g., 123 Main St, City, Country)</li>
            <li><strong>role</strong>: Role of the user (default: customer)</li>
            <li><strong>status</strong>: Status of the user (default: active)</li>
          </ul>
          <p className="mb-4 text-sm text-gray-600">
            <strong>Example CSV Format:</strong>
          </p>
          <table className="mb-6 w-full text-sm text-left text-gray-600 border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">name</th>
                <th className="border px-4 py-2">email</th>
                <th className="border px-4 py-2">mobile_number</th>
                <th className="border px-4 py-2">address</th>
                <th className="border px-4 py-2">role</th>
                <th className="border px-4 py-2">status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">john_doe</td>
                <td className="border px-4 py-2">john@example.com</td>
                <td className="border px-4 py-2">1234567890</td>
                <td className="border px-4 py-2">123 Main St, City, Country</td>
                <td className="border px-4 py-2">customer</td>
                <td className="border px-4 py-2">active</td>
              </tr>
            </tbody>
          </table>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" />
          <Button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>
          <Button
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            onClick={handleUploadClick}
          >
            Upload File
          </Button>
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
        {importResult && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md mt-6 text-center">
            <p>Import Result:</p>
            <p>Successful Imports: {importResult.success}</p>
            <p>Failed Imports: {importResult.failed}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ImportUsers;
