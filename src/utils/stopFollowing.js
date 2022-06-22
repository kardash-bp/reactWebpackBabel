import axios from 'axios'

export const stopFollowing = async (profileData, userToken, setData) => {
  try {
    const response = await axios.post(
      `/removeFollow/${profileData.profileUsername}`,
      {
        token: userToken,
      }
    )
    console.log(response.data)
    const obj = { ...profileData, isFollowing: !profileData.isFollowing }
    setData({ ...obj })
    console.log(profileData)
  } catch (err) {
    console.log(err.message)
  }
  console.log('stop loading')
}
