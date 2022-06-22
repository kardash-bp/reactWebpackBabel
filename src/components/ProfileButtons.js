import React from 'react'
import { NavLink } from 'react-router-dom'

const ProfileButtons = ({ username, counts }) => {
  return (
    <div className='list-group list-group-horizontal'>
      <NavLink className='list-group-item disabled' to='#'>
        Posts: {counts.postCount}
      </NavLink>
      <NavLink
        to={`/profile/${username}/following`}
        className='list-group-item'
      >
        Following: {counts.followingCount}
      </NavLink>
      <NavLink
        to={`/profile/${username}/followers`}
        className='list-group-item'
      >
        Followers: {counts.followerCount}
      </NavLink>
    </div>
  )
}

export default ProfileButtons
