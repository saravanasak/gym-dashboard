import Link from 'next/link';
import { useState } from 'react';
import { FaUsers, FaClipboardList, FaDumbbell, FaChartBar, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import { MdMenu, MdClose } from 'react-icons/md';

const AdminLayout = ({ children }) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      {/* Sidebar Navigation */}
      <div className={`${isMenuExpanded ? 'w-64' : 'w-20'} bg-blue-900 p-4 text-white transition-all duration-300 ease-in-out min-h-screen relative`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={toggleMenu} className="focus:outline-none text-white">
            {isMenuExpanded ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
          {isMenuExpanded && <h2 className="text-xl font-bold transition-all duration-300 ml-4">Ironman Fitness Studio</h2>}
        </div>
        <ul className="space-y-4 mt-6">
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-blue-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/manageUsers" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-300">
                <FaUsers size={20} />
                {isMenuExpanded && <span>Manage Users</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-blue-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/managePlans" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-300">
                <FaClipboardList size={20} />
                {isMenuExpanded && <span>Manage Plans</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-blue-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/manageEquipment" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-300">
                <FaDumbbell size={20} />
                {isMenuExpanded && <span>Manage Equipment</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-blue-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/viewReports" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-300">
                <FaChartBar size={20} />
                {isMenuExpanded && <span>View Reports</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-blue-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/paymentHistory" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-300">
                <FaMoneyBillWave size={20} />
                {isMenuExpanded && <span>Payment History</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-blue-700 p-2 rounded-md transition-all">
            <Link href="/logout" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-300">
                <FaSignOutAlt size={20} />
                {isMenuExpanded && <span>Logout</span>}
              </a>
            </Link>
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-grow p-10 bg-white text-black shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
