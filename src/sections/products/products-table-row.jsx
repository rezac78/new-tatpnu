import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Avatar, Tooltip } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import fa from 'src/locales/fa';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ProductsTableRow({
  row,
  selected,
  rowCount,
  onEditRow,
  onSelectRow,
  onTeacherRow,
  onDeleteRow,
}) {
  const confirm = useBoolean();
  const t = fa;

  const popover = usePopover();

  const quickEdit = useBoolean();
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell className="!font-digit w-10">{rowCount + 1}</TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.title}
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.category_title}
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.title} src={row.banner} />
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="استاد" placement="top" arrow>
              <IconButton
                onClick={() => {
                  onTeacherRow();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="24"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="black"
                    d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91c-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62C.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38c.33-62.14-49.94-112.62-112-112.62m-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96s-96 42.98-96 96s42.98 96 96 96M592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0"
                  />
                </svg>
              </IconButton>
            </Tooltip>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t.dashboard.tableCommon.delete}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {t.dashboard.tableCommon.edit}
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t.dashboard.tableCommon.delete}
        content={t.dashboard.tableCommon.deleteQus}
        cancel={t.dashboard.tableCommon.cancel}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t.dashboard.tableCommon.delete}
          </Button>
        }
      />
    </>
  );
}
