import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('pulse-user')) || null,
  isAuthenticated: !!localStorage.getItem('pulse-user'),
  
  login: (userData) => {
    localStorage.setItem('pulse-user', JSON.stringify(userData))
    set({ user: userData, isAuthenticated: true })
  },
  
  logout: () => {
    localStorage.removeItem('pulse-user')
    set({ user: null, isAuthenticated: false })
  },
  
  updateProfile: (updates) => {
    const currentUser = get().user
    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem('pulse-user', JSON.stringify(updatedUser))
    set({ user: updatedUser })
  }
}))

export default useAuthStore