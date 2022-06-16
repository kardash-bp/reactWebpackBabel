import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'
import LoadingDots from './LoadingDots'
import Page from './Page'

const ViewSinglePost = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { postId } = useParams()
  console.log(postId)
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
        console.log(err.message)
      }
    })()
    return () => {
      ct.cancel()
    }
  }, [])
  if (isLoading)
    return (
      <Page title='...'>
        <LoadingDots />
      </Page>
    )
  console.log(post)
  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        <span className='pt-2'>
          <a href='#' className='text-primary mr-2' title='Edit'>
            <i className='fas fa-edit'></i>
          </a>
          <a className='delete-post-button text-danger' title='Delete'>
            <i className='fas fa-trash'></i>
          </a>
        </span>
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

      <div className='body-content'>{post.body}</div>
    </Page>
  )
}

export default ViewSinglePost
