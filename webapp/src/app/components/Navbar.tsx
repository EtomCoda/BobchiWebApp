'use client'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faQuestionCircle, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-[#278245]">
      <div className="container mx-auto flex justify-between items-center h-24 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="text-white text-3xl sm:text-4xl lg:text-6xl font-['Bayon']">
          <a href="/">BOBCHI GAS</a>
        </div>

        {/* Medium Screens: Contact Us and Place Order Links */}
        <div className="hidden md:flex space-x-4 md:space-x-8">
          <a href="/order" className="text-white text-lg sm:text-xl lg:text-[35px] font-semibold font-['Inter'] hover:text-gray-300">Place Order</a>
          
        </div>

        {/* Hamburger Menu (Visible on Small and Medium Screens) */}
        <button onClick={toggleMenu} className="text-white focus:outline-none md:hidden">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
        </button>
        
        {/* Medium Screens: Three Icons Inside the Hamburger */}
        <div className="hidden md:flex space-x-8">
          <a href="/cart" className="text-white">
            <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6 sm:h-8 sm:w-8" />
          </a>

          <a href="/help" className="text-white">
            <FontAwesomeIcon icon={faQuestionCircle} className="h-6 w-6 sm:h-8 sm:w-8" />
          </a>

          <a href="/user" className="text-white">
            <FontAwesomeIcon icon={faUser} className="h-6 w-6 sm:h-8 sm:w-8" />
          </a>
        </div>
      </div>

      {/* Hamburger Menu Dropdown for Small Screens */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#278245] px-4 py-4">
          {/* Links for Small Screens */}
          <a href="/order" className="block text-white text-lg font-semibold font-['Inter'] hover:text-gray-300 mb-2">Place Order</a>
          

          {/* Icons for Small Screens */}
          <a href="/cart" className="block text-white mb-2">
            <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6" />
            <span className="ml-2">Orders</span>
          </a>
          <a href="/help" className="block text-white mb-2">
            <FontAwesomeIcon icon={faQuestionCircle} className="h-6 w-6" />
            <span className="ml-2">Help</span>
          </a>
          <a href="/user" className="block text-white">
            <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
            <span className="ml-2">Account</span>
          </a>
        </div>
      )}

      <div className="w-full h-2 bg-[#0b4916]" />
    </div>
  );
}
