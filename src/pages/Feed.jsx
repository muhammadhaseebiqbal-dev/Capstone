import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader, Filter } from 'lucide-react'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import TrendingSidebar from '../components/TrendingSidebar'
import usePostStore from '../store/postStore'

function Feed() {
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedPosts, setDisplayedPosts] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const posts = usePostStore(state => state.posts)

  let filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort posts
  filteredPosts = filteredPosts.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'mostLiked':
        return b.likes.length - a.likes.length
      case 'mostCommented':
        return b.comments.length - a.comments.length
      default:
        return 0
    }
  })

  const visiblePosts = filteredPosts.slice(0, displayedPosts)
  const hasMore = displayedPosts < filteredPosts.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    setTimeout(() => {
      setDisplayedPosts(prev => prev + 5)
      setIsLoading(false)
    }, 800)
  }, [isLoading, hasMore])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  useEffect(() => {
    setDisplayedPosts(5)
  }, [searchTerm])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts or people..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 bg-gray-900 border border-gray-700 rounded-full transition-colors ${
                  showFilters ? 'bg-white text-black' : 'hover:bg-gray-800'
                }`}
              >
                <Filter className="w-5 h-5 text-white" />
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 bg-gray-900 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'newest', label: 'Newest' },
                    { value: 'oldest', label: 'Oldest' },
                    { value: 'mostLiked', label: 'Most Liked' },
                    { value: 'mostCommented', label: 'Most Commented' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        sortBy === option.value
                          ? 'bg-white text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <CreatePost />

          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-gray-400">
                  {searchTerm ? 'Try a different search term' : 'Be the first to share something!'}
                </p>
              </motion.div>
            ) : (
              <>
                {visiblePosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center py-8"
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-full p-4">
                      <Loader className="w-6 h-6 text-white animate-spin" />
                    </div>
                  </motion.div>
                )}
                
                {!hasMore && filteredPosts.length > 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-full px-6 py-3 inline-block">
                      <span className="text-gray-400">You've reached the end! 🎉</span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <TrendingSidebar />
        </div>
      </div>
    </div>
  )
}

export default Feed