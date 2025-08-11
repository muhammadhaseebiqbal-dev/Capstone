import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Layout from './components/Layout'

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return (
    <Router>
      <div className="min-h-screen relative bg-black">
        
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/feed" /> : <Login />
          } />
          <Route path="/" element={
            isAuthenticated ? <Layout /> : <Navigate to="/login" />
          }>
            <Route index element={<Navigate to="/feed" />} />
            <Route path="feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            }
          }}
        />
      </div>
    </Router>
  )
}

export default App