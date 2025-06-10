import { useState } from 'react'
import { InputAdornment, IconButton, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const EUROPEAN_PHONE_PREFIXES = ['+49', '+34', '+33', '+44']

const PREFIX_FLAGS: Record<string, string> = {
  '+49': '🇩🇪', // Germany
  '+34': '🇪🇸', // Spain
  '+33': '🇫🇷', // France
  '+44': '🇬🇧', // United Kingdom
}

interface PrefixProps {
  phonePrefix: string
  onChange: (prefix: string) => void
}

const Prefix = ({ phonePrefix, onChange: setPhonePrefix }: PrefixProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleSelect = (prefix: string) => {
    setPhonePrefix(prefix)
    setAnchorEl(null)
    if (window && window.localStorage) {
      window.localStorage.setItem('phonePrefix', phonePrefix)
    }
  }

  return (
    <InputAdornment position="start">
      <span>{phonePrefix}</span>
      <IconButton size="small" onClick={handleClick} aria-label="select prefix" style={{ marginRight: -9, marginLeft: -6 }}>
        <ArrowDropDownIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {EUROPEAN_PHONE_PREFIXES.map(option => (
          <MenuItem
            key={option}
            selected={option === phonePrefix}
            onClick={() => handleSelect(option)}
          >
            <span style={{ marginRight: 8 }}>{PREFIX_FLAGS[option]}</span>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </InputAdornment>
  )
}

export default Prefix