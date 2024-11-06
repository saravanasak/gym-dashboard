import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import AdminLayout from '../../../components/AdminLayout';

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('customer');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [viewUserDetails, setViewUserDetails] = useState<any | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Fetch users, payments, and plans from the database
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase.from('payments').select('*');
    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data);
    }
  };

  const fetchPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) {
      console.error("Error fetching plans:", error);
    } else {
      setPlans(data);
    }
  };

  // Fetch users, payments, and plans when the component loads
  useEffect(() => {
    fetchUsers();
    fetchPayments();
    fetchPlans();
  }, []);

  // Handle sorting
  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);

    const sortedUsers = [...users].sort((a, b) => {
      if (a[field] < b[field]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setUsers(sortedUsers);
  };

  // Handle adding a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // If editing a user, update the user instead of adding a new one
    if (editUserId) {
      handleEditUser(e);
      return;
    }

    if (!password) {
      setMessage("Error: Password is required to add a new user.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Step 1: Check if the username, email, or mobile number already exists if adding a new user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .or(
        `name.eq.${username.toLowerCase()},email.eq.${email.toLowerCase()},mobile_number.eq.${mobileNumber}`
      );

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore error if no user is found
      console.error("Error fetching user:", fetchError);
      setMessage("Error: Could not verify user details.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (existingUser && existingUser.length > 0) {
      setMessage("Error: Username, email, or mobile number already exists. Please choose a different one.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Step 2: Hash the password
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 3: Insert the new user
      const { data, error } = await supabase.from('users').insert([
        {
          name: username.toLowerCase(),
          role,
          status,
          password: hashedPassword,
          member_id: `MEM${String(users.length + 1).padStart(2, '0')}`, // Generate member ID
          mobile_number: mobileNumber,
          email: email.toLowerCase(),
          address: address,
        },
      ]);

      if (error) {
        console.error("Error adding user:", error);
        setMessage(`Error: Could not add user. Details: ${error.message}`);
      } else {
        setMessage("User added successfully!");
        await fetchUsers(); // Refresh user list after adding
        setUsername('');
        setRole('customer');
        setStatus('active');
        setPassword('');
        setMobileNumber('');
        setEmail('');
        setAddress('');
      }
    } catch (err: any) {
      console.error("Error hashing password or inserting user:", err);
      setMessage(`Error: Could not add user. Details: ${err.message}`);
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle editing a user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedFields: any = { name: username, role, status, mobile_number: mobileNumber, email, address };
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const { error } = await supabase
      .from('users')
      .update(updatedFields)
      .eq('id', editUserId);

    if (error) {
      console.error("Error updating user:", error);
      setMessage("Error: Could not update user.");
    } else {
      setMessage("User updated successfully!");
      await fetchUsers(); // Refresh user list after editing
      setEditUserId(null);
      setUsername('');
      setRole('customer');
      setStatus('active');
      setPassword('');
      setMobileNumber('');
      setEmail('');
      setAddress('');
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async (userId: number) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
      console.error("Error deleting user:", error);
      setMessage("Error: Could not delete user.");
    } else {
      setMessage("User deleted successfully!");
      await fetchUsers(); // Refresh user list after deleting
    }

    setTimeout(() => setMessage(null), 3000);
  };

  // Handle clicking "View" button
  const handleViewUser = (user: any) => {
    const userPayments = payments.filter(payment => payment.user_id === user.id);
    userPayments.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()); // Sort payments by date (recent first)

    const planDetails = userPayments.map(payment => {
      const plan = plans.find(plan => plan.id === payment.plan_id);
      return {
        transactionId: payment.transaction_id,
        amount: payment.amount,
        date: payment.date,
        expiryDate: payment.expiry_date,
        planName: plan ? plan.name : 'No plan',
        planId: plan ? plan.plan_id : 'N/A'
      };
    });

    setViewUserDetails({
      ...user,
      paymentHistory: userPayments,
      expiryDate: userPayments.length > 0 ? userPayments[0].expiry_date : 'N/A',
      planDetails,
    });
  };

  // Handle clicking "Edit" button
  const handleEditClick = (user: any) => {
    setEditUserId(user.id);
    setUsername(user.name);
    setRole(user.role);
    setStatus(user.status);
    setPassword(''); // Clear password field on edit
    setMobileNumber(user.mobile_number);
    setEmail(user.email);
    setAddress(user.address);
  };

  // Filter users by search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.member_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex-grow p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen font-sans">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Users</h1>

        {message && (
          <div
            className={`p-4 rounded-md text-center font-bold mb-6 shadow-lg transform transition-all duration-300 ease-in-out ${
              message.startsWith("Error")
                ? "bg-red-100 text-red-600 border border-red-400"
                : "bg-green-100 text-green-600 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Username or Member ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
        </div>

        {/* Table for displaying users */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border-collapse rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th
                  className="py-4 px-6 border-b text-left text-lg font-semibold cursor-pointer hover:bg-blue-600"
                  onClick={() => handleSort('name')}
                >
                  Username {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="py-4 px-6 border-b text-left text-lg font-semibold cursor-pointer hover:bg-blue-600"
                  onClick={() => handleSort('member_id')}
                >
                  Member ID {sortField === 'member_id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-4 px-6 border-b text-left text-lg font-semibold">Role</th>
                <th className="py-4 px-6 border-b text-left text-lg font-semibold">Status</th>
                <th className="py-4 px-6 border-b text-left text-lg font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="py-4 px-6 border-b text-base text-gray-800">{user.name}</td>
                  <td className="py-4 px-6 border-b text-base text-gray-800">{user.member_id}</td>
                  <td className="py-4 px-6 border-b text-base text-gray-800">{user.role}</td>
                  <td className="py-4 px-6 border-b text-base text-gray-800">{user.status}</td>
                  <td className="py-4 px-6 border-b text-base text-gray-800">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="px-5 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 shadow-lg transform hover:scale-105"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-5 py-2 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 shadow-lg transform hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-5 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 shadow-lg transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form for adding or editing users */}
        <form onSubmit={handleAddUser} className="mb-8 space-y-4 bg-white p-10 rounded-lg shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{editUserId ? "Edit User" : "Add User"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-lg">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-lg">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editUserId}
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-lg">Mobile Number</label>
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-lg">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-2 text-lg">Address</label>
              <textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-lg">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-lg">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-10 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 shadow-lg transform hover:scale-105 mt-6 block mx-auto"
          >
            {editUserId ? "Update User" : "Add User"}
          </button>
        </form>

        {/* View User Modal */}
        {viewUserDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-2xl transform transition-all duration-500 ease-in-out" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <button
                  onClick={() => setViewUserDetails(null)}
                  className="px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 shadow-md"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
                  <p className="font-semibold text-sm">Username:</p>
                  <p className="text-gray-800 text-base">{viewUserDetails.name}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
                  <p className="font-semibold text-sm">Member ID:</p>
                  <p className="text-gray-800 text-base">{viewUserDetails.member_id}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
                  <p className="font-semibold text-sm">Mobile Number:</p>
                  <p className="text-gray-800 text-base">{viewUserDetails.mobile_number}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
                  <p className="font-semibold text-sm">Email:</p>
                  <p className="text-gray-800 text-base">{viewUserDetails.email}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 shadow-md md:col-span-2">
                  <p className="font-semibold text-sm">Address:</p>
                  <p className="text-gray-800 text-base">{viewUserDetails.address}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
                  <p className="font-semibold text-sm">Expiry Date:</p>
                  <p className="text-gray-800 text-base">{viewUserDetails.expiryDate}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Payment History</h3>
              {viewUserDetails.planDetails.length > 0 ? (
                <div className="space-y-4">
                  {viewUserDetails.planDetails.map((planDetail: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-sm">Transaction ID:</p>
                          <p className="text-gray-800 text-base">{planDetail.transactionId}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Amount:</p>
                          <p className="text-gray-800 text-base">${planDetail.amount}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Date:</p>
                          <p className="text-gray-800 text-base">{planDetail.date}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Expiry Date:</p>
                          <p className="text-gray-800 text-base">{planDetail.expiryDate}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Plan Name:</p>
                          <p className="text-gray-800 text-base">{planDetail.planName}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Plan ID:</p>
                          <p className="text-gray-800 text-base">{planDetail.planId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-800 text-base">No payment history available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
