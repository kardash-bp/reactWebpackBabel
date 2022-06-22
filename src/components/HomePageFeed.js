import axios from 'axios'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import LoadingDots from './LoadingDots'
import Page from './Page'
import Post from './Post'

const HomePageFeed = () => {
  const [loading, setLoading] = useState(true)
  const [feed, setFeed] = useState([])
  const { state } = useContext(AppContext)

  useEffect(() => {
    const ct = axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await axios.post(
          `/getHomeFeed`,
          {
            token: state.user.token,
          },
          { cancelToken: ct.token }
        )
        console.log(response.data)
        setLoading(false)
        setFeed(response.data)
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchData()
    return () => ct.cancel()
  }, [])
  if (loading) {
    return <LoadingDots />
  }
  return (
    <Page title='Your Feed'>
      {feed.length > 0 && (
        <>
          <h2 className='text-center mb-4'>The Latest From Those You Follow</h2>
          <div className='list-group'>
            <Suspense fallback={<LoadingDots />}>
              {feed.map((item) => (
                <Post post={item} key={item._id} />
              ))}
            </Suspense>
          </div>
        </>
      )}
      {feed.length === 0 && (
        <>
          <h2 className='text-center'>
            Hello <strong>{state.user.username}</strong>, your feed is empty.
          </h2>
          <p className='text-center'>Your feed display the latest post</p>
        </>
      )}
    </Page>
  )
}

export default HomePageFeed
