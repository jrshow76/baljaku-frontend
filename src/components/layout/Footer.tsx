'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} BalJaKuk. All rights reserved.
      </Typography>
    </Box>
  );
}
