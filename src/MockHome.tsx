import { Box, Typography, Link } from '@mui/material'

const MockHome = () => {
  return (
    <Box sx={{ textAlign: 'left', mt: 5 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Welcome to Your New Account!
      </Typography>
      <Typography variant="caption" sx={{ mb: 3, textAlign: 'left' }}>
        Thank you for joining us. Your account has been successfully created. As a valued customer, you now have access to a range of services designed to make your experience secure and convenient.
      </Typography>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Get started
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body1" color="primary">
          <Link href="#" underline="hover" color="inherit">
            Complete your profile
          </Link>
        </Typography>
        <Typography variant="body1" color="primary">
          <Link href="#" underline="hover" color="inherit">
            Know our products and services
          </Link>
        </Typography>
        <Typography variant="body1" color="primary">
          <Link href="#" underline="hover" color="inherit">
            Customer support
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default MockHome
