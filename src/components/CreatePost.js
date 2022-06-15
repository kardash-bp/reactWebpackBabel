import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import Page from './Page'

const CreatePost = () => {
  const { state, dispatch } = useContext(AppContext)

  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/create-post', {
        title,
        body,
        token: state.user.token,
      })
      dispatch({
        type: 'addFlashMsg',
        payload: 'Congrats,you successfully created a post.',
      })
      navigate(`/${response.data}`)
    } catch (err) {
      console.log(err.message)
    }
  }
  return (
    <Page>
      <form onSubmit={handleSubmit}>
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
          />
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
          ></textarea>
        </div>

        <button className='btn btn-primary'>Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
