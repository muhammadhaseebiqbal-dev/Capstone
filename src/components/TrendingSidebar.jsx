import { motion } from 'framer-motion'
import { TrendingUp, Hash, Users } from 'lucide-react'
import usePostStore from '../store/postStore'

function TrendingSidebar() {
  const posts = usePostStore(state => state.posts)

  // Extract trending hashtags
  const getTrendingHashtags = () => {
    const hashtagCount = {}
    posts.forEach(post => {
      const hashtags = post.content.match(/#\w+/g) || []
      hashtags.forEach(tag => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1
      })
    })
    
    return Object.entries(hashtagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))
  }

  // Get most active users
  const getActiveUsers = () => {
    const userActivity = {}
    posts.forEach(post => {
      const userId = post.authorId
      if (!userActivity[userId]) {
        userActivity[userId] = {
          name: post.authorName,
          avatar: post.authorAvatar,
          posts: 0,
          likes: 0
        }
      }
      userActivity[userId].posts++
      userActivity[userId].likes += post.likes.length
    })

    return Object.values(userActivity)
      .sort((a, b) => (b.posts + b.likes) - (a.posts + a.likes))
      .slice(0, 3)
  }

  const trendingHashtags = getTrendingHashtags()
  const activeUsers = getActiveUsers()

  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Trending</h3>
        </div>
        
        {trendingHashtags.length === 0 ? (
          <p className="text-white/60 text-sm">No trending topics yet</p>
        ) : (
          <div className="space-y-3">
            {trendingHashtags.map(({ tag, count }, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{tag.slice(1)}</span>
                </div>
                <span className="text-white/60 text-sm">{count} posts</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Active Users */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Active Users</h3>
        </div>
        
        {activeUsers.length === 0 ? (
          <p className="text-white/60 text-sm">No active users yet</p>
        ) : (
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.name}</p>
                  <p className="text-white/60 text-sm">
                    {user.posts} posts • {user.likes} likes
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-white font-semibold mb-4">Community Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/70">Total Posts</span>
            <span className="text-white font-semibold">{posts.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Total Likes</span>
            <span className="text-white font-semibold">
              {posts.reduce((acc, post) => acc + post.likes.length, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Total Comments</span>
            <span className="text-white font-semibold">
              {posts.reduce((acc, post) => acc + post.comments.length, 0)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TrendingSidebar