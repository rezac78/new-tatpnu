import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import fa from 'src/locales/fa';
import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }) {
  const t = fa;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>{t.dashboard.DRD}</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          فایل خود را در اینجا رها کنید یا آنها را از
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            سیستم
          </Box>
          انتخاب کنید
        </Box>
      </Stack>
    </Box>
  );
}
