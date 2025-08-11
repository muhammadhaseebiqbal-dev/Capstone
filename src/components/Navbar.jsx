import { Link, useLocation } from 'react-router-dom'
import { Home, User, LogOut, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import NotificationBell from './NotificationBell'

function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/feed" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Pulse</span>
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}

            <div className="flex items-center space-x-3">
              <NotificationBell />
              
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar