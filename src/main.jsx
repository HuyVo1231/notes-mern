import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { REACT_APP_GOOGLE_CLIENT_ID } from './utils/contants.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
