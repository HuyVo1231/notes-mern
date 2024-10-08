import { useState } from 'react'
import Input from '../../components/Input/Input'
import Navbar from '../../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import { validateEmail } from './../../utils/helper'
import axiosInstance from './../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Invalid email address')
      return
    }

    setError('')

    // Login API call
    try {
      const response = await axiosInstance.post('/v1/login', {
        email: email,
        password: password
      })

      // Handle success
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      // Handle Login Error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred while trying to login. Please try again.')
      }
    }
  }

  const handleLoginWithGoogle = async (response) => {
    try {
      const result = await axiosInstance.post('/v1/google-login', { id_token: response.credential })
      localStorage.setItem('token', result.data.token)
      navigate('/dashboard')
    } catch (error) {
      console.error('Google login failed:', error)
      setError('An error occurred while trying to login with Google. Please try again.')
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSubmit}>
            <h4 className='text-2xl mb-7'>Login</h4>
            <Input
              type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className='text-sm text-red-500'>{error}</p>}
            <button type='submit' className='btn-primary'>
              Login
            </button>
            <div className='flex flex-col gap-2 justify-center items-center'>
              <span>OR</span>
              <div className='text-base flex items-center gap-2'>
                Login with{' '}
                <GoogleLogin
                  onSuccess={handleLoginWithGoogle}
                  onError={(error) => console.error('Google Login Error:', error)}
                />
              </div>
            </div>

            <p className='text-sm text-center mt-4'>
              Not registered yet?{' '}
              <Link to='/signup' className='font-medium text-primary underline'>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
