import React from "react";   

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-3">
        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">CS</span>
        </div> */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CleanSwift</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
