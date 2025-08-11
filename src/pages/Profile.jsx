import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Calendar, MapPin, Link as LinkIcon, Save, X, Camera, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import usePostStore from '../store/postStore'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'

function Profile() {
  const { user, updateProfile } = useAuthStore()
  const posts = usePostStore(state => state.posts)
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    avatar: user.avatar
  })

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }
      
      setIsUploadingAvatar(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target.result
        setEditData(prev => ({ ...prev, avatar: result }))
        setIsUploadingAvatar(false)
        toast.success('Avatar updated!')
      }
      reader.readAsDataURL(file)
    }
  }

  const userPosts = posts.filter(post => post.authorId === user.id)

  const handleSave = () => {
    updateProfile(editData)
    setIsEditing(false)
    toast.success('Profile updated!')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative group">
            <img
              src={editData.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white/20"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-4 border-white/20"></div>
            
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAvatarModal(true)}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/30 focus:outline-none focus:border-purple-500"
                />
              ) : (
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              )}

              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:scale-105 transition-transform"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-full hover:scale-105 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                className="w-full p-3 glass-dark rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            ) : (
              <p className="text-white/80 mb-4">{user.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-white/60">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(user.joinedAt)}</span>
              </div>

              {(isEditing || user.location) && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Location"
                      className="bg-transparent border-b border-white/30 focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <span>{user.location}</span>
                  )}
                </div>
              )}

              {(isEditing || user.website) && (
                <div className="flex items-center space-x-2">
                  <LinkIcon className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={editData.website}
                      onChange={(e) => setEditData({...editData, website: e.target.value})}
                      placeholder="Website"
                      className="bg-transparent border-b border-white/30 focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                      {user.website}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userPosts.length}</div>
            <div className="text-white/60">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userPosts.reduce((acc, post) => acc + post.likes.length, 0)}
            </div>
            <div className="text-white/60">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userPosts.reduce((acc, post) => acc + post.comments.length, 0)}
            </div>
            <div className="text-white/60">Comments</div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Posts</h2>
        
        {userPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass rounded-2xl"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-12 h-12 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-white/60">Share your first post to get started!</p>
          </motion.div>
        ) : (
          userPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        )}
      </div>

      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Update Profile Picture"
      >
        <div className="space-y-4">
          <div className="text-center">
            <img
              src={editData.avatar}
              alt="Current avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/20"
            />
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span>Upload New Photo</span>
            </button>
            
            <button
              onClick={() => {
                setEditData(prev => ({ 
                  ...prev, 
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}` 
                }))
                toast.success('Avatar randomized!')
              }}
              className="w-full py-3 glass-dark text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Generate Random Avatar
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                updateProfile({ avatar: editData.avatar })
                setShowAvatarModal(false)
                toast.success('Profile picture updated!')
              }}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditData(prev => ({ ...prev, avatar: user.avatar }))
                setShowAvatarModal(false)
              }}
              className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </Modal>
    </div>
  )
}

export default Profile