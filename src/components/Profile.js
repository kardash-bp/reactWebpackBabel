import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../App'
import Page from './Page'
import ProfilePosts from './ProfilePosts'

const Profile = () => {
  const { state } = useContext(AppContext)
  const { username } = useParams()
  const [profileData, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 },
  })
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`/profile/${username}`, {
          token: state.user.token,
        })
        setProfileData(response.data)
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchData()
  }, [])
  return (
    <Page title='Profile Page'>
      <h2>
        <img className='avatar-small' src={profileData.profileAvatar} />{' '}
        {profileData.profileUsername}
        <button className='btn btn-primary btn-sm ml-2'>
          Follow <i className='fas fa-user-plus'></i>
        </button>
      </h2>

      <div className='profile-nav nav nav-tabs pt-2 mb-4'>
        <a href='#' className='active nav-item nav-link'>
          Posts: {profileData.counts.postCount}
        </a>
        <a href='#' className='nav-item nav-link'>
          Followers: {profileData.counts.followerCount}
        </a>
        <a href='#' className='nav-item nav-link'>
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts username={username} />
    </Page>
  )
}

export default Profile
