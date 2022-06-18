import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { AppContext } from '../App'
import { formatDate } from '../utils/formatDate'
import LoadingDots from './LoadingDots'
import Page from './Page'

const ViewSinglePost = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { postId } = useParams()
  useEffect(() => {
    const ct = axios.CancelToken.source()
    ;(async () => {
      try {
        const response = await axios.get(`/post/${postId}`, {
          cancelToken: ct.token,
        })
        setPost(response.data)
        setIsLoading(false)
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(err.message)
        }
        console.error(err.message)
      }
    })()
    return () => {
      ct.cancel()
    }
  }, [])
  if (isLoading) {
    return (
      <Page title='...'>
        <LoadingDots />
      </Page>
    )
  }
  const isOwner = () => {
    if (state.loggedIn) {
      return state.user.username === post.author.username
    }
    return false
  }
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure?')
    if (confirmDelete) {
      try {
        const res = await axios.delete(`/post/${postId}`, {
          data: { token: state.user.token },
        })
        if (res.data === 'Success') {
          dispatch({
            type: 'addFlashMsg',
            payload: 'Post was successfully deleted.',
          })
          navigate(`/profile/${state.user.username}`)
        }
      } catch (err) {
        console.log(err.message)
      }
    }
  }
  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <button
              data-tip='Edit'
              data-for='edit'
              data-background-color='#007BFF'
              className='btn btn-primary mr-2'
              onClick={() =>
                navigate('/create-post', { state: { post, edit: true } })
              }
            >
              <i className='fas fa-edit'></i>
            </button>
            <ReactTooltip id='edit' className='custom-tooltip' />{' '}
            <button
              data-tip='Delete'
              data-for='del'
              data-type='error'
              className='btn btn-danger'
              onClick={handleDelete}
            >
              <i className='fas fa-trash'></i>
            </button>
            <ReactTooltip id='del' className='custom-tooltip' />
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' src={post.author.avatar} />
        </Link>
        Posted by{' '}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{' '}
        on {formatDate(post.createdDate)}
      </p>

      <div className='body-content'>
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
