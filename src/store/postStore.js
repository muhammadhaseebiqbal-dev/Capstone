import { create } from 'zustand'

const usePostStore = create((set, get) => ({
  posts: JSON.parse(localStorage.getItem('pulse-posts')) || [],
  
  addPost: (post) => {
    const newPost = {
      id: Date.now().toString(),
      ...post,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
    const updatedPosts = [newPost, ...get().posts]
    localStorage.setItem('pulse-posts', JSON.stringify(updatedPosts))
    set({ posts: updatedPosts })
  },
  
  deletePost: (postId) => {
    const updatedPosts = get().posts.filter(post => post.id !== postId)
    localStorage.setItem('pulse-posts', JSON.stringify(updatedPosts))
    set({ posts: updatedPosts })
  },
  
  likePost: (postId, userId) => {
    const posts = get().posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userId)
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId]
        }
      }
      return post
    })
    localStorage.setItem('pulse-posts', JSON.stringify(posts))
    set({ posts })
  },
  
  addComment: (postId, comment) => {
    const posts = get().posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: Date.now().toString(),
            ...comment,
            createdAt: new Date().toISOString()
          }]
        }
      }
      return post
    })
    localStorage.setItem('pulse-posts', JSON.stringify(posts))
    set({ posts })
  }
}))

export default usePostStore