import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Image, Send, X, Upload, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import usePostStore from '../store/postStore'

function CreatePost() {
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { user } = useAuthStore()
  const { addPost } = usePostStore()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target.result
        setImage(result)
        setImagePreview(result)
        setShowImageInput(true)
        setIsUploading(false)
        toast.success('Image uploaded!')
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage('')
    setImagePreview('')
    setShowImageInput(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Please write something!')
      return
    }

    addPost({
      content: content.trim(),
      image: image.trim() || null,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar
    })

    setContent('')
    setImage('')
    setImagePreview('')
    setShowImageInput(false)
    toast.success('Post shared!')
  }

  const handleShare = () => {
    handleSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6"
    >
      <div className="flex space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full border-2 border-gray-600"
        />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && content.trim()) {
                e.preventDefault()
                handleShare()
              }
            }}
            placeholder="What's on your mind?"
            className="w-full p-4 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
            rows="3"
          />

          {showImageInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value)
                      setImagePreview(e.target.value)
                    }}
                    placeholder="Image URL (optional)"
                    className="flex-1 px-4 py-2 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageInput(false)}
                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Image className="w-5 h-5" />
                <span>URL</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleShare}
              disabled={!content.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-white text-black font-semibold rounded-full pulse-button disabled:opacity-50 disabled:cursor-not-allowed relative z-10 hover:bg-gray-100 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CreatePost