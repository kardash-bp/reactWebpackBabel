import axios from 'axios'

export const startFollowing = async (profileData, userToken, setData) => {
  try {
    const response = await axios.post(
      `/addFollow/${profileData.profileUsername}`,
      {
        token: userToken,
      }
    )
    const obj = { ...profileData, isFollowing: response.data }
    setData({ ...obj })
  } catch (err) {
    console.log(err.message)
  }

  console.log('stop loading')
}
