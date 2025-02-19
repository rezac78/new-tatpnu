// @mui
import { Box, Stack, Typography } from '@mui/material';

import UploadIllustration from '../../../assets/illustration_upload';
// assets

// ----------------------------------------------------------------------

export default function BlockContent({ ...other }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <UploadIllustration sx={{ width: 220 }} />
      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          {other.message ? other.message : 'فایل را رها یا انتخاب کنید'}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {other.guidance ? (
            other.guidance
          ) : (
            <>
              فایل خود را در اینجا رها کنید یا آنها را از&nbsp;
              <Typography
                variant="body2"
                component="span"
                sx={{ color: 'primary.main', textDecoration: 'underline' }}
              >
                سیستم
              </Typography>
              &nbsp;انتخاب کنید
            </>
          )}
        </Typography>
      </Box>
    </Stack>
  );
}
