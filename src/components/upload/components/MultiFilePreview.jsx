import isString from 'lodash/isString';
import { m, AnimatePresence } from 'framer-motion';

// @mui
import { alpha } from '@mui/material/styles';
import { List, Stack, Button, ListItem, IconButton, ListItemText } from '@mui/material';

// import {varFade} from '../animate';
import fa from 'src/locales/fa';

//
import Image from './Image';
import Iconify from './Iconify';
// utils
import { fData } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const getFileData = (file) => {
  if (typeof file === 'string') {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};

export default function MultiFilePreview({
  uploadBtn = false,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
}) {
  const hasFile = files.length > 0;
  const t = fa;

  return (
    <>
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files.map((file) => {
            const { key, name, size, preview } = getFileData(file);

            if (showPreview) {
              return (
                <ListItem
                  key={key}
                  component={m.div}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.25,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Image alt="preview" src={isString(file) ? file : preview} ratio="1/1" />
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 6,
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon="eva:close-fill" />
                  </IconButton>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={key}
                component={m.div}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Iconify
                  icon="eva:file-fill"
                  sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }}
                />

                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? '' : fData(size || 0)}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                  className='w-20 line-clamp-2'
                />

                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>

      {hasFile && uploadBtn && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            {t.store.common.delete}
          </Button>
          <Button size="small" variant="contained">
            {t.store.common.upload}
          </Button>
        </Stack>
      )}
    </>
  );
}
