import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'

const Post = ({ author, post, onClick }) => {
  return (
    <Link
      onClick={onClick}
      to={`/posts/${post._id}`}
      // key={post._id}
      className='list-group-item list-group-item-action'
    >
      <img className='avatar-tiny' src={post.author.avatar} />{' '}
      <strong>{post.title}</strong>{' '}
      <span className='text-muted small'>
        {!author && <> by {post.author.username}</>} on{' '}
        {formatDate(post.createdDate)}{' '}
      </span>
    </Link>
  )
}

export default Post
