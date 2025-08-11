import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Trash2, Send, Share, Bookmark, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import usePostStore from '../store/postStore'

function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { user } = useAuthStore()
  const { likePost, addComment, deletePost } = usePostStore()

  const isLiked = post.likes.includes(user.id)
  const canDelete = post.authorId === user.id

  const handleLike = () => {
    setIsLikeAnimating(true)
    likePost(post.id, user.id)
    setTimeout(() => setIsLikeAnimating(false), 600)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on Pulse',
        text: post.content,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could add toast here
    }
  }

  const handleComment = () => {
    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }
    
    addComment(post.id, {
      text: comment.trim(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar
    })
    setComment('')
    toast.success('Comment added!')
  }

  const formatTime = (dateString) => {
    const now = new Date()
    const postTime = new Date(dateString)
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-12 h-12 rounded-full border-2 border-gray-600"
          />
          <div>
            <h3 className="text-white font-semibold">{post.authorName}</h3>
            <p className="text-gray-400 text-sm">{formatTime(post.createdAt)}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-12 bg-black border border-gray-600 rounded-xl p-2 min-w-[120px] z-20"
              >
                {canDelete && (
                  <button
                    onClick={() => {
                      deletePost(post.id)
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsBookmarked(!isBookmarked)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-white' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-white mb-4 leading-relaxed relative z-10">{post.content}</p>

      {post.image && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative mb-4 rounded-xl overflow-hidden"
        >
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-700 relative z-10">
        <div className="flex items-center space-x-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors relative ${
              isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              {isLikeAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 text-red-400"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </motion.div>
              )}
            </div>
            <span>{post.likes.length}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <Share className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <div className="flex space-x-3 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && comment.trim()) {
                    e.preventDefault()
                    handleComment()
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-black border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              />
              <button
                type="button"
                onClick={handleComment}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-black border border-gray-600 rounded-2xl px-4 py-2">
                    <p className="text-gray-300 font-medium text-sm">{comment.authorName}</p>
                    <p className="text-white">{comment.text}</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 ml-4">
                    {formatTime(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PostCard