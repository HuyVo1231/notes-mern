export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const getInitial = (name) => {
  if (!name) return ''

  const words = name.split(' ')
  let initials = ''

  for (let i = 0; i < words.length; i++) {
    initials += words[i].charAt(0).toUpperCase()
  }
  return initials
}
