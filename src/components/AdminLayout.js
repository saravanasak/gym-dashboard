import Link from 'next/link';
import { useState } from 'react';
import { FaHome, FaUsers, FaClipboardList, FaDumbbell, FaChartBar, FaMoneyBillWave, FaSignOutAlt, FaBell, FaFileImport, FaFileExport } from 'react-icons/fa';
import { MdMenu, MdClose } from 'react-icons/md';
import Image from 'next/image';

const AdminLayout = ({ children }) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <div className={`${isMenuExpanded ? 'w-64' : 'w-20'} bg-gray-800 p-4 text-white transition-all duration-300 ease-in-out min-h-screen`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={toggleMenu} className="focus:outline-none text-white">
            {isMenuExpanded ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        {isMenuExpanded && (
          <div className="flex items-center justify-center mb-6 bg-white p-4 rounded-md h-32">
            <Image src="/assets/logo.png" alt="Ironman Fitness Studio Logo" width={150} height={150} className="object-contain" />
          </div>
        )}
        <ul className="space-y-4 mt-6">
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaHome size={20} />
                {isMenuExpanded && <span>Home</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/manageUsers" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaUsers size={20} />
                {isMenuExpanded && <span>Manage Users</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/managePlans" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaClipboardList size={20} />
                {isMenuExpanded && <span>Manage Plans</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/manageEquipment" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaDumbbell size={20} />
                {isMenuExpanded && <span>Manage Equipment</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/viewReports" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaChartBar size={20} />
                {isMenuExpanded && <span>View Reports</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/paymentHistory" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaMoneyBillWave size={20} />
                {isMenuExpanded && <span>Payment History</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/notifications" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaBell size={20} />
                {isMenuExpanded && <span>Notifications</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/export" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaFileExport size={21} />
                {isMenuExpanded && <span>Export</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/dashboard/admin/importUsers" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaFileImport size={20} />
                {isMenuExpanded && <span>Import Users</span>}
              </a>
            </Link>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-all">
            <Link href="/logout" legacyBehavior>
              <a className="flex items-center space-x-3 text-base hover:text-yellow-500">
                <FaSignOutAlt size={20} />
                {isMenuExpanded && <span>Logout</span>}
              </a>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10 overflow-auto bg-gray-100 text-black shadow-md">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
