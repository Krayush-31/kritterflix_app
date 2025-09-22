import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const userInitial = "A";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        <Link
          to="/"
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold 
                     bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 
                     bg-clip-text text-transparent 
                     drop-shadow-[0_2px_8px_rgba(255,0,0,0.6)] 
                     tracking-tight hover:scale-105 transition-transform duration-300"
        >
          Kritterflix
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          <Link
            to="/search"
            className="p-2 sm:px-4 sm:py-2 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            <FaSearch className="text-lg sm:text-base" />
          </Link>

          <Link
            className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
             items-center justify-center border border-red-600 rounded-full 
             text-red-600 font-semibold hover:bg-red-600 hover:text-white 
             transition-colors duration-200"
          >
            {userInitial}
          </Link>
        </div>
      </div>
    </nav>
  );
}
