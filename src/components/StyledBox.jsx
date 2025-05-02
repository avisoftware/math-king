import { Box} from '@mui/material'
import styled from 'styled-components'

export const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  padding: 1rem;
`