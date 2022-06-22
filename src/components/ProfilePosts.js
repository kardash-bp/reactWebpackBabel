import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'
import LoadingDots from './LoadingDots'
import Post from './Post'

const ProfilePosts = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const ct = axios.CancelToken.source()
    ;(async () => {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: ct.token,
        })
        setPosts(response.data)
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
      }
    })()
    return () => ct.cancel()
  }, [username])
  if (isLoading) return <LoadingDots />

  return (
    <div className='list-group'>
      {posts.map((post) => (
        <Post author={true} post={post} key={post._id} />
      ))}
    </div>
  )
}

export default ProfilePosts
