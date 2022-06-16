import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'
import LoadingDots from './LoadingDots'

const ProfilePosts = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get(`/profile/${username}/posts`)
        setPosts(response.data)
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
      }
    })()
  }, [])
  if (isLoading) return <LoadingDots />

  return (
    <div className='list-group'>
      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/posts/${post._id}`}
          className='list-group-item list-group-item-action'
        >
          <img className='avatar-tiny' src={post.author.avatar} />{' '}
          <strong>{post.title}</strong>
          <span className='text-muted small'>
            {' '}
            on {formatDate(post.createdDate)}{' '}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default ProfilePosts
