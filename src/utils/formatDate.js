export const formatDate = (dt) => {
  const date = new Date(dt)
  return `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`
}
