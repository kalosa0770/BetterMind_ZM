import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, LogOut, Lock, CircleHelp, Info, Link, Bell, Settings } from 'lucide-react';

// --- Local Components ---

/**
 * Reusable List Item component with the Teal/Gray palette.
 */
const SettingsListItem = ({ icon, label, onClick, isDestructive = false }) => {
  // Styling uses the Teal/Gray palette
  const baseClasses = "flex items-center text-left gap-5 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg";
  
  // Apply Teal accent for hover states
  const colorClasses = isDestructive
    ? "text-red-600 font-semibold hover:bg-red-50"
    : "text-gray-700 hover:bg-teal-50 hover:text-teal-700";

  return (
    <li className={`${baseClasses} ${colorClasses}`} onClick={onClick}>
      <div className="text-xl">{icon}</div>
      <span className="text-base font-medium">{label}</span>
    </li>
  );
};

/**
 * Custom styled header component for sections.
 */
const SectionHeader = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-4">
        {title}
    </h3>
);

// --- Main Application Component (Must be named App) ---

const UserSettings = () => {
  // State to manage the view: true for settings, false for dashboard
  const [showSettings, setShowSettings] = useState(false);
  
  // Mock User State
  const user = {
    name: "Alex Johnson",
    email: "alex.j@example.com"
  };

  // --- Utility Functions ---

  const handleLogout = () => {
    // Note: Using alert() instead of window.location.href for safe iframe execution.
    console.log("Logging out user...");
    setShowSettings(false); 
    alert('Logged out successfully (Simulated)'); 
  };
  
  const handleBack = () => {
    setShowSettings(true); // Go back to the dashboard view
  };
  
  // --- Navigation Data Configuration ---

  const accountNavItems = [
    { icon: <Bell size={20} />, label: "Notifications", action: () => alert("Notifications clicked") },
    { icon: <User size={20} />, label: "Manage Account", action: () => alert("Account clicked") },
    { icon: <CreditCard size={20} />, label: "Manage Subscription", action: () => alert("Subscription clicked") },
    { icon: <Link size={20} />, label: "Link Organisation Subscription", action: () => alert("Organization Link clicked") },
  ];

  const supportNavItems = [
    { icon: <Lock size={20} />, label: "Privacy & Security", action: () => alert("Privacy clicked") },
    { icon: <CircleHelp size={20} />, label: "Help & Support", action: () => alert("Help clicked") },
    { icon: <Info size={20} />, label: "About BetterMind", action: () => alert("About clicked") },
  ];


  // User Settings View
  return (
    <div className="relative flex flex-col w-full vh-100 bg-gray-50 font-sans shadow-2xl">
      
      {/* Header (Sticky top for navigation with White background) */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-start p-4 bg-white shadow-md z-10 border-b border-gray-200">
        <ArrowLeft 
          size={25} 
          // Teal accent color for the back button
          className="cursor-pointer text-teal-600 bg-gray-100 rounded-full p-1 w-8 h-8 transition-colors hover:bg-gray-200" 
          onClick={handleBack} 
        />
        <h2 className="text-xl font-bold text-gray-800 ml-4">Account & Settings</h2>
      </div>

     

      {/* Settings Navigation Sections */}
      <div className="p-5 flex flex-col gap-6 w-full">
        
        {/* Account Management Section */}
        <section>
            <SectionHeader title="Your Account" />
            <nav className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <ul className='list-none p-0 m-0 divide-y divide-gray-100'>
                {accountNavItems.map((item, index) => (
                    <SettingsListItem 
                        key={`account-${index}`} 
                        icon={item.icon} 
                        label={item.label} 
                        onClick={item.action}
                    />
                ))}
                </ul>
            </nav>
        </section>

        {/* Support and Legal Section */}
        <section>
            <SectionHeader title="Application & Support" />
            <nav className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <ul className='list-none p-0 m-0 divide-y divide-gray-100'>
                {supportNavItems.map((item, index) => (
                    <SettingsListItem 
                        key={`support-${index}`} 
                        icon={item.icon} 
                        label={item.label} 
                        onClick={item.action}
                    />
                ))}
                </ul>
            </nav>
        </section>

        {/* Action Button Section (Logout) */}
        <section>
            <nav className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <ul className='list-none p-0 m-0'>
                    <SettingsListItem 
                        icon={<LogOut size={20} />} 
                        label="Log Out" 
                        onClick={handleLogout}
                        isDestructive={true}
                    />
                </ul>
            </nav>
        </section>

        {/* Footer info */}
        <p className="text-xs text-center text-gray-400 mt-4 pb-4">
            BetterMind Version 1.2.0 | All Rights Reserved
        </p>

      </div>
    </div>
  );
};

export default UserSettings;