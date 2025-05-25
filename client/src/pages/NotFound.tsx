import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-gray-100">
          404
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          Oops! Page not found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
