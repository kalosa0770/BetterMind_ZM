import React from 'react';
import { ArrowLeft, User, CreditCard, LogOut, Lock, CircleHelp, Info, Link, Bell } from 'lucide-react';

// Reusable List Item component to maintain consistent styling and spacing
const SettingsListItem = ({ icon, label, onClick, isDestructive = false }) => {
  // Matches original CSS: margin: 10px 0, gap: 20px, text-align: left
  const baseClasses = "flex items-center text-left gap-5 py-2 cursor-pointer transition-colors";
  
  // Accent color mapping: --accent-color (teal) & --text-color-secondary (gray)
  const colorClasses = isDestructive
    ? "text-red-500 font-semibold hover:bg-red-50"
    : "text-gray-600 hover:text-teal-600"; // Simple list item style (no hover background)

  return (
    <li className={`${baseClasses} ${colorClasses}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </li>
  );
};

const UserSettings = ({ onBack }) => {

  const handleLogout = () => {
    // Clear token and redirect to homepage/login.
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  // Grouped Navigation Items
  const accountNavItems = [
    { icon: <Bell size={18} />, label: "Notifications" },
    { icon: <User size={18} />, label: "Manage Account" },
    { icon: <CreditCard size={18} />, label: "Manage Subscription" },
    { icon: <Link size={18} />, label: "Link Organisation Subscription" },
  ];

  const supportNavItems = [
    { icon: <Lock size={18} />, label: "Privacy & Security" },
    { icon: <CircleHelp size={18} />, label: "Help & Support" },
    { icon: <Info size={18} />, label: "About BetterMind" },
  ];

  return (
    // Equivalent to .user-settings-container
    <div className="flex flex-col w-full h-full min-h-screen bg-gray-50 animate-in fade-in slide-in-from-right duration-500">
      
      {/* Header (Equivalent to .user-settings-header) */}
      <div className="sticky top-0 flex items-center justify-start p-4 bg-white shadow-sm z-10">
        {/* Equivalent to .back-icon */}
        <ArrowLeft 
          size={25} 
          className="cursor-pointer text-teal-600 bg-gray-100 rounded-full p-1 w-8 h-8 transition-colors hover:bg-gray-200" 
          onClick={onBack} 
        />
        {/* Equivalent to .user-settings-header h2 */}
        <h2 className="text-lg font-bold text-gray-800 ml-4">User Settings</h2>
      </div>

      {/* Content Area (Equivalent to .user-settings-content) */}
      <div className="p-5 flex flex-col gap-5 w-full">
        
        {/* Equivalent to .manage-account-section */}
        <div className='w-full'>
          <nav className='p-0 m-0'>
            <ul className='list-none p-0 m-0 space-y-1'>
              
              {/* Account Management Group */}
              {accountNavItems.map((item, index) => (
                <SettingsListItem key={index} icon={item.icon} label={item.label} />
              ))}

              {/* Equivalent to hr (height: 0.8px, background-color: #ccc) */}
              <hr className="border-gray-300 my-4" />

              {/* Privacy and Support Group */}
              {supportNavItems.map((item, index) => (
                <SettingsListItem key={index} icon={item.icon} label={item.label} />
              ))}

              <hr className="border-gray-300 my-4" />

              {/* Logout Button */}
              <SettingsListItem 
                icon={<LogOut size={18} />} 
                label="Log Out" 
                onClick={handleLogout}
                isDestructive={true}
              />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
