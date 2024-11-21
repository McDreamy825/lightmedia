import { Link, useLocation } from 'react-router-dom';
import { Home, User, Mail } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-8">Image Gallery</h1>
      <nav className="space-y-4">
        <Link
          to="/"
          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Gallery</span>
        </Link>
        <Link
          to="/admin"
          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            isActive('/admin') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Admin Login</span>
        </Link>
        <Link
          to="/contact"
          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            isActive('/contact') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span>Contact Us</span>
        </Link>
      </nav>
    </div>
  );
}