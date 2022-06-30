import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingDots from './LoadingDots'
import Page from './Page'

const ProfileFollowing = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const { username } = useParams()
  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get(`/profile/${username}/following`)
        setPosts(response.data)
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
      }
    })()
  }, [username])
  if (isLoading) return <LoadingDots />
  return (
    <Page title='Following'>
      <h2>Following</h2>
      <p>
        <Link to={`/profile/${username}`} className='list-group-item'>
          Back to profile
        </Link>
      </p>
      {Array.isArray(posts) &&
        posts.map((follower, index) => (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className='list-group-item list-group-item-action'
          >
            <img className='avatar-tiny' src={follower.avatar} />
            {follower.username}
          </Link>
        ))}
    </Page>
  )
}

export default ProfileFollowing
