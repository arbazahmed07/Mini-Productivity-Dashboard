import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, LogIn, UserPlus, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { path: "/login", label: "Login", icon: LogIn },
    { path: "/register", label: "Register", icon: UserPlus }
  ];

  const privateNavItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/profile", label: "Profile", icon: User }
  ];

  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-2xl border border-gray-200/20 dark:border-gray-700/20 animate-fade-in">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          {isAuthenticated && (
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full p-3 shadow-2xl border border-gray-200/20 dark:border-gray-700/20 transition-all duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />
            <nav className="fixed top-16 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-gray-200/20 dark:border-gray-700/20 min-w-[200px] animate-fade-in">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={closeMobileMenu}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                {isAuthenticated && (
                  <Button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                )}
              </div>
            </nav>
          </>
        )}
      </div>

      {/* Bottom Navigation for Mobile (Alternative approach) */}
      {/* Uncomment this section if you prefer bottom navigation on mobile */}
      {/*
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-2xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`w-full flex flex-col items-center px-2 py-3 h-auto transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          {isAuthenticated && (
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center px-2 py-3 h-auto hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mb-1" />
              <span className="text-xs">Logout</span>
            </Button>
          )}
        </div>
      </nav>
      */}
    </>
  );
};

export default Navigation;