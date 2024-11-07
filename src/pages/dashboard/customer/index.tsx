import React from 'react';

const CustomerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        {/* Placeholder for an icon or logo */}
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Customer Dashboard (Under Development)
                    </h2>
                </div>
                <div className="mt-8 space-y-6 text-center">
                    <p className="text-white text-lg">
                        For more information, contact us at <a href="mailto:contact@excham.com" className="text-yellow-500">contact@excham.com</a>
                        <br />
                        or visit <a href="https://www.excham.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500">www.excham.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
