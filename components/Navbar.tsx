import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, MapPin, AlertTriangle, Shield, CheckCircle, Camera, Users, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "#", label: "Dashboard", icon: null, isActive: true },
    { href: "#", label: "Cameras", icon: Camera, isActive: false },
    { href: "#", label: "Scenes", icon: null, isActive: false },
    { href: "#", label: "Incidents", icon: AlertTriangle, isActive: false },
    { href: "#", label: "Users", icon: Users, isActive: false },
  ];

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <h1 className="text-lg sm:text-xl font-bold text-white">MANDLACX</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-2 transition-colors ${
                  item.isActive
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded"></div>
                )}
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Right side - User info and Mobile menu button */}
        <div className="flex items-center space-x-4">
          {/* User Info - Hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-300">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
              MA
            </div>
            <div className="hidden md:block">
              <div className="text-white">Mohammed Ajhas</div>
              <div className="text-xs text-slate-500">ajhas@mandlac.com</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-800 border-b border-slate-700 shadow-lg z-50">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  item.isActive
                    ? "text-blue-400 bg-slate-700"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {item.isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded"></div>
                )}
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </a>
            ))}
            
            {/* User info in mobile menu */}
            <div className="sm:hidden mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3 px-3 py-2 text-slate-300">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
                  MA
                </div>
                <div>
                  <div className="text-white text-sm">Mohammed Ajhas</div>
                  <div className="text-xs text-slate-500">ajhas@mandlac.com</div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;