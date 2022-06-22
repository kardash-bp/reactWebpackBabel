import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, NavLink, Routes, Route } from 'react-router-dom'
import { AppContext } from '../App'
import { startFollowing } from '../utils/startFollowing'
import { stopFollowing } from '../utils/stopFollowing'
import Page from './Page'
import ProfilePosts from './ProfilePosts'

const Profile = () => {
  const { state, dispatch } = useContext(AppContext)
  const { username } = useParams()
  const [profileData, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 },
  })
  const [loading, setLoading] = useState(false)
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
  }, [username])

  useEffect(() => {
    if (!loading) return
    if (!profileData.isFollowing) {
      startFollowing(profileData, state.user.token, setProfileData)
      dispatch({ type: 'startFollowing', payload: profileData.profileUsername })
    } else if (profileData.isFollowing) {
      stopFollowing(profileData, state.user.token, setProfileData)
      dispatch({ type: 'stopFollowing', payload: profileData.profileUsername })
    }
    setLoading(false)
  }, [loading])

  const handleClick = () => {
    setLoading(true)
    console.log('loading')
  }
  console.log(state.followingUsers)
  return (
    <Page title='Profile Page'>
      <h2>
        <img className='avatar-small' src={profileData.profileAvatar} />{' '}
        {profileData.profileUsername}{' '}
        {state.loggedIn && state.user.username != username && (
          <button
            onClick={handleClick}
            className={`btn btn-${
              !profileData.isFollowing ? 'primary' : 'danger'
            } btn-sm ml-2`}
            disabled={loading}
          >
            {!profileData.isFollowing ? 'Follow' : 'Stop Following'}{' '}
            <i className='fas fa-user-plus'></i>
          </button>
        )}
      </h2>

      <ProfilePosts username={username} />
    </Page>
  )
}

export default Profile
