export const validate = (name, value) => {
  if (!value.trim()) {
    return { name, message: `You must provide a ${name}!` }
  } else {
    return { name: '', message: '' }
  }
}
export const validateSubmit = (value) => {
  return value.trim() ? false : true
}
