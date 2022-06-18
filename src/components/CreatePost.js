import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AppContext } from '../App'
import { validate, validateSubmit } from '../utils/validate'
import Page from './Page'
const CreatePost = () => {
  const { state, dispatch } = useContext(AppContext)
  const location = useLocation()
  const [postId, setPostId] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editForm, setEditForm] = useState(false)
  const [err, setErr] = useState({ name: '', message: '' })
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const { post, edit } = location.state
      console.log(post)
      setTitle(post.title)
      setPostId(post._id)
      setBody(post.body)
      setEditForm(edit)
    }
  }, [location.state])
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateSubmit(title) || validateSubmit(body)) return
    try {
      if (editForm) {
        const response = await axios.post(`/post/${postId}/edit`, {
          title,
          body,
          token: state.user.token,
        })
        dispatch({
          type: 'addFlashMsg',
          payload: 'This post has been successfully updated.',
        })

        navigate(`/posts/${postId}`)
      } else {
        const response = await axios.post('/create-post', {
          title,
          body,
          token: state.user.token,
        })

        if (Array.isArray(response.data) && Array(response.data).length) {
          console.log(response.data)
          return setErr({ name: 'title', message: response.data[0] })
        } else {
          console.log(response.data)
          dispatch({
            type: 'addFlashMsg',
            payload: 'Congrats,you successfully created a post.',
          })
          navigate(`/posts/${response.data}`)
        }
      }
    } catch (err) {
      console.log(err.message)
    }
  }
  return (
    <Page title={editForm ? 'Edit-post' : 'New Post'}>
      {editForm && (
        <Link to={`/posts/${postId}`} className='small font-weight-bold'>
          &laquo; Back to post page.
        </Link>
      )}
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='post-title' className='text-muted mb-1'>
            <small>Title</small>
          </label>
          <input
            autoFocus
            name='title'
            id='post-title'
            className='form-control form-control-lg form-control-title'
            type='text'
            placeholder=''
            autoComplete='off'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => {
              setErr({ ...validate(e.target.name, e.target.value) })
            }}
          />
          {err.name === 'title' && (
            <div className='alert alert-danger small liveValidateMessage'>
              {err.message}
            </div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='post-body' className='text-muted mb-1 d-block'>
            <small>Body Content</small>
          </label>
          <textarea
            name='body'
            id='post-body'
            className='body-content tall-textarea form-control'
            type='text'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={(e) => {
              setErr({ ...validate(e.target.name, e.target.value) })
            }}
          ></textarea>
          {err.name === 'body' && (
            <div className='alert alert-danger small liveValidateMessage'>
              {err.message}
            </div>
          )}
        </div>

        <button className='btn btn-primary' disabled={err.name}>
          {editForm ? 'Edit Post' : 'Save New Post'}
        </button>
      </form>
    </Page>
  )
}

export default CreatePost
