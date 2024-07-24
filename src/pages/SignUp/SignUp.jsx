import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Input from '../../components/Input/Input'
import { validateEmail } from './../../utils/helper'
import axiosInstance from './../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Invalid email address')
      return
    }

    if (!name || !password) {
      setError('Please fill all the fields')
      return
    }
    setError('')

    // call api sign up
    try {
      const response = await axiosInstance.post('/v1/create-account', {
        fullName: name,
        email: email,
        password: password
      })

      // Handle success signup
      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      // Handle Login Error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred while trying to login. Please try again.')
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-10'>
        <div className='w-96 border bg-white rounded px-4 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>Sign Up</h4>

            <Input
              type='text'
              placeholder='Name'
              className='input-box'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              className='input-box'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className='text-sm text-red-500'>{error}</p>}

            <button className='btn-primary'>Sign Up</button>

            <p className='text-sm text-center mt-4'>
              Already have an account?{' '}
              <Link to='/login' className='font-medium text-primary underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp
