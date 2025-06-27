import { useCallback, useEffect, useState } from 'react'
import { Box, Typography, TextField, InputAdornment, Button, Alert, IconButton, CircularProgress } from '@mui/material'
import '@fontsource/inter/700.css'
import '@fontsource/inter/400.css'
import './styles/App.css'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import MockHome from './MockHome'
import Prefix from './Prefix'
import { v4 as randomUUID } from 'uuid'

const GERMANY_PHONE_PREFIX = '+49'

const Signup = () => {
  const [userId, setUserId] = useState('')
  const [isPhoneNumber, setIsPhoneNumber] = useState(true)
  const [phonePrefix, setPhonePrefix] = useState(GERMANY_PHONE_PREFIX)
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [messageVerificationCode, setMessageVerificationCode] = useState<string>('')
  const [verificationResult, setVerificationResult] = useState<boolean | undefined>()
  const [userAlreadyExists, setUserAlreadyExists] = useState<boolean>(false)
  const [signupCompleted, setSignupCompleted] = useState<boolean | undefined>()
  const [networkRequestId, setNetworkRequestId] = useState<string | undefined>()
  const [isNetworkAuthenticated, setIsNetworkAuthenticated] = useState<boolean>(false)

  const networkAuthorize = useCallback(async () => {
    if (!networkRequestId) return

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: isPhoneNumber ? `${phonePrefix}${userId.trim()}` : userId.trim(),
          state: networkRequestId,
        }),
      })

      if (!response.ok) {
        setVerificationResult(false)
        setIsSubmitting(false)
        return
      }

      const result = await response.json()
      if (result?.auth_url) {
        window.addEventListener('message', (event) => {
          if (event.origin !== 'http://localhost:3000') return

          const { status } = event.data
          if (status === 'authorized') {
            setIsNetworkAuthenticated(true)
          }
        })
        window.open(result.auth_url, '_blank', 'location=yes,height=500,width=500')
      } else {
        throw new Error("auth_url not present")
      }

    } catch (err) {
      console.error('Authorization failed:', err)
      setVerificationResult(false)
      setIsSubmitting(false)
    }
  }, [networkRequestId])

  const performSignup = useCallback(() => {
    const params = new URLSearchParams(networkRequestId ? { state: networkRequestId } : {})
    setIsSubmitting(true)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/signup?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: isPhoneNumber ? `${phonePrefix}${userId.trim()}` : userId.trim(),
        ...(password ? { password: password.trim() } : {}),
      })
    })
      .then(async response => {
        if (response.status === 409) {
          setUserAlreadyExists(true)
          setVerificationResult(undefined)
          setSignupCompleted(undefined)
          return
        }
        const result = await response.json()
        setUserAlreadyExists(false)
        setVerificationResult(result.verified)
        setSignupCompleted(result.verified)
        setShowPassword(false)
      })
      .catch(() => {
        setVerificationResult(false)
        setSignupCompleted(false)
      })
      .finally(() => setIsSubmitting(false))
  }, [isPhoneNumber, networkRequestId, userId, phonePrefix, password])

  const verifyMessageVerificationCode = useCallback(() => {
    if (!messageVerificationCode.trim()) return
    setIsSubmitting(true)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: isPhoneNumber ? `${phonePrefix}${userId.trim()}` : userId.trim(),
        code: messageVerificationCode.trim(),
      })
    })
      .then(async response => {
        if ([200, 304].includes(response.status)) {
          setVerificationResult(true)
          setSignupCompleted(true)
          setShowPassword(false)
        } else {
          setVerificationResult(false)
          setSignupCompleted(false)
        }
      })
      .catch(() => {
        setVerificationResult(false)
        setSignupCompleted(false)
      })
      .finally(() => setIsSubmitting(false))
  }, [userId, isPhoneNumber, phonePrefix, messageVerificationCode])
  
  useEffect(() => {
    if (!networkRequestId) return
    if (isPhoneNumber && !isNetworkAuthenticated) {
      networkAuthorize()
    }
    if (!isPhoneNumber && networkRequestId) {
      performSignup()
    }
  }, [networkRequestId, isPhoneNumber, isNetworkAuthenticated])
  
  useEffect(() => {
    if (isNetworkAuthenticated) {
      performSignup()
    }
  }, [isNetworkAuthenticated])
  
  useEffect(() => {
    if (verificationResult === false && networkRequestId && isPhoneNumber && isNetworkAuthenticated) {
      performSignup()
    }
  }, [verificationResult, networkRequestId, isPhoneNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (verificationResult === false) {
      verifyMessageVerificationCode()
    } else if (!isNetworkAuthenticated && isPhoneNumber) {
      setNetworkRequestId(randomUUID())
    } else {
      performSignup()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    const phoneRegex = /^[0-9]{1,15}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setUserId(value)
    setIsPhoneNumber(phoneRegex.test(value) || value === '')
    setEmailError(!isPhoneNumber && !emailRegex.test(value))
  }
  
  return (
    <div className="mobile">
      <Box sx={{ padding: 5 }}>
        <Typography variant="h5" gutterBottom color='primary' align='left'>
          Mock company
        </Typography>
        <Typography variant="h2" gutterBottom align='left' sx={{ wordBreak: 'break-word' }}>
          User registration
        </Typography>
        {signupCompleted !== true &&
          <Typography variant="caption" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            If you use your phone number we can verify your identity with your operator and it will not be necessary to send a verification link.
          </Typography>
        }
        {signupCompleted !== true &&
          <form onSubmit={handleSubmit}>
            <TextField
              type={isPhoneNumber ? 'tel' : 'email'}
              autoComplete={isPhoneNumber ? 'tel' : 'email'}
              label="Phone number or email"
              name="userId"
              value={userId}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              slotProps={{
                input: isPhoneNumber && userId.trim().length > 0 ? {
                  startAdornment: <Prefix phonePrefix={phonePrefix} onChange={setPhonePrefix} />,
                } : {}
              }}
              error={emailError || (isPhoneNumber && verificationResult === false)}
              helperText={emailError ? "Enter a valid phone number or email" : ""}
              disabled={signupCompleted === false}
            />
            {verificationResult === false &&
              <TextField
                type="number"
                label="Verification code"
                name="code"
                value={messageVerificationCode}
                onChange={e => setMessageVerificationCode(e.target.value)}
                fullWidth
                margin="normal"
                required
                error={messageVerificationCode.trim().length > 0 && !/^\d+$/.test(messageVerificationCode.trim())}
              />
            }
            {verificationResult !== false &&
              <TextField
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required={!isPhoneNumber}
                disabled={signupCompleted === false}
                helperText="Optional if you use your phone number"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            }
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={
                isSubmitting ||
                userId.trim() === '' ||
                (!isPhoneNumber && password.trim() === '') ||
                (verificationResult === false && messageVerificationCode.trim() === '')
              }
            >
              {isSubmitting && <CircularProgress size={24} color="inherit" />}
              {!isSubmitting ? 'Confirm my registration' : ''}
            </Button>
          </form>
        }
        {userAlreadyExists === true &&
          <Alert severity="error" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            User already exists
          </Alert>
        }
        {verificationResult === false &&
          <Alert severity="info" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            We could not verify your number with your operator. We have sent a verification code to complete the process. Please check your phone or email.
          </Alert>
        }
        {signupCompleted === true && <>
          <Alert severity="success" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            Your registration has been completed
          </Alert>
          <MockHome />
        </>}
      </Box>
    </div>
  )
}

export default Signup
