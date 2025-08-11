import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Heart, MessageCircle, User } from 'lucide-react'
import useAuthStore from '../store/authStore'
import usePostStore from '../store/postStore'

function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user } = useAuthStore()
  const posts = usePostStore(state => state.posts)

  useEffect(() => {
    const userPosts = posts.filter(post => post.authorId === user.id)
    const newNotifications = []

    userPosts.forEach(post => {
      post.likes.forEach(likeUserId => {
        if (likeUserId !== user.id) {
          newNotifications.push({
            id: `like-${post.id}-${likeUserId}`,
            type: 'like',
            message: 'liked your post',
            postContent: post.content.slice(0, 30) + '...',
            time: new Date().toISOString(),
            read: false
          })
        }
      })

      post.comments.forEach(comment => {
        if (comment.authorId !== user.id) {
          newNotifications.push({
            id: `comment-${comment.id}`,
            type: 'comment',
            message: 'commented on your post',
            postContent: post.content.slice(0, 30) + '...',
            time: comment.createdAt,
            read: false
          })
        }
      })
    })

    setNotifications(newNotifications.slice(0, 10))
  }, [posts, user.id])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-400" />
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400" />
      default: return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const formatTime = (dateString) => {
    const now = new Date()
    const notifTime = new Date(dateString)
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white/70 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-80 glass-dark rounded-xl p-4 z-50"
          >
            <h3 className="text-white font-semibold mb-3">Notifications</h3>
            
            {notifications.length === 0 ? (
              <p className="text-white/60 text-center py-4">No notifications yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm">
                        Someone {notification.message}
                      </p>
                      <p className="text-white/60 text-xs truncate">
                        "{notification.postContent}"
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {formatTime(notification.time)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell