// src/components/Footer.js

// 1. Import Lucide Icons (replacing FontAwesome)
import { Mail, Facebook, MessageCircle } from 'lucide-react'; 
// Tailwind CSS replaces the need for './Footer.css'
// import './Footer.css'; 
import greenTealIcon from './assets/emoji-icon.png'; 

const Footer = () => {
  return (
    // Base Footer: Background neutral color, primary text color, padding
    <footer className="bg-[#f4f5f6] text-[#333333] pt-10 pb-4">
      
      {/* Footer Content Wrapper: Centered, responsive layout (stacked on mobile, row on desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
        
        {/* Footer Logo Container */}
        <div className="flex items-center space-x-3">
          <img src={greenTealIcon} alt="BetterMind ZM Logo" className="w-16 h-16" />
          <div>
            {/* Primary text color, large font */}
            <h2 className="text-2xl font-bold text-[#333333]">BetterMind ZM</h2>
            <p className="text-sm text-gray-600">Your Mental Wellness Partner</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center md:text-left">
          {/* Primary action color for heading */}
          <h4 className="text-lg font-semibold mb-3 text-[#008080]">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              {/* Primary action color for hover */}
              <a href="#about" className="hover:text-[#008080] transition duration-300">About Us</a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#008080] transition duration-300">Services</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#008080] transition duration-300">Contact</a>
            </li>
          </ul>
        </div>

        {/* Footer Socials */}
        <div className="text-center md:text-left">
          {/* Primary action color for heading */}
          <h4 className="text-lg font-semibold mb-3 text-[#008080]">Connect with Us</h4>
          <div className="flex space-x-4 justify-center md:justify-start">
            
            {/* Social Icon Links */}
            
            {/* Email (Mail Icon) */}
            <a href="mailto:info@bettermindzm.com" target="_blank" rel="noopener noreferrer" 
               // Primary action color, secondary accent color for hover
               className="text-2xl text-[#008080] hover:text-[#9bb8a1] transition duration-300">
                <Mail size={24} /> 
            </a>
            
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
               // Primary action color, secondary accent color for hover
               className="text-2xl text-[#008080] hover:text-[#9bb8a1] transition duration-300">
                <Facebook size={24} />
            </a>
            
            {/* WhatsApp/Message (MessageCircle Icon) */}
            <a href="https://wa.me/2609xxxxxxxx" target="_blank" rel="noopener noreferrer" 
               // Primary action color, secondary accent color for hover
               className="text-2xl text-[#008080] hover:text-[#9bb8a1] transition duration-300">
                <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Horizontal Line Separator */}
      <hr className="my-8 border-gray-300 max-w-7xl mx-auto" />
      
      {/* Footer Bottom (Copyright) */}
      <div className="text-center text-sm text-gray-600 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} BetterMind ZM. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;