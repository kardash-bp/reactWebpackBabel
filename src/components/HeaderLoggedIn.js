import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import ReactTooltip from 'react-tooltip'
const HeaderLoggedIn = () => {
  const { state, dispatch } = useContext(AppContext)

  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch({ type: 'logout' })
    dispatch({
      type: 'addFlashMsg',
      payload: 'You have successfully been logged out.',
    })
    navigate('/')
  }
  return (
    <div className='flex-row my-3 my-md-0'>
      <a
        onClick={() => dispatch({ type: 'openSearch' })}
        href='#'
        className='text-white mr-2 header-search-icon'
        data-for='search'
        data-tip='Search'
      >
        <i className='fas fa-search'></i>
      </a>
      <ReactTooltip place='bottom' id='search' className='custom-tooltip' />{' '}
      <span
        data-for='chat'
        data-tip='Chat'
        className='mr-2 header-chat-icon text-white'
      >
        <i className='fas fa-comment'></i>
        <span className='chat-count-badge text-white'> </span>
      </span>
      <ReactTooltip place='bottom' id='chat' className='custom-tooltip' />{' '}
      <Link
        data-for='profile'
        data-tip='My Profile'
        to={`/profile/${state.user.username}`}
        className='mr-2'
      >
        <img className='small-header-avatar' src={state.user.avatar} />
      </Link>
      <ReactTooltip place='bottom' id='profile' className='custom-tooltip' />{' '}
      <Link className='btn btn-sm btn-success mr-2' to='/create-post'>
        Create Post
      </Link>{' '}
      <button onClick={handleLogout} className='btn btn-sm btn-secondary'>
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
