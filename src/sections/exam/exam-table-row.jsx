import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, Tooltip } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import fa from 'src/locales/fa';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ExamTableRow({
  row,
  selected,
  rowCount,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onExamQuestionRow,
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
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.title}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            {row.time_exam}
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="اضافه کردن سوال" placement="top" arrow>
              <IconButton
                onClick={() => {
                  onExamQuestionRow();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="gray"
                    d="M144 180a16 16 0 1 1-16-16a16 16 0 0 1 16 16m92-52A108 108 0 1 1 128 20a108.12 108.12 0 0 1 108 108m-24 0a84 84 0 1 0-84 84a84.09 84.09 0 0 0 84-84m-84-64c-24.26 0-44 17.94-44 40v4a12 12 0 0 0 24 0v-4c0-8.82 9-16 20-16s20 7.18 20 16s-9 16-20 16a12 12 0 0 0-12 12v8a12 12 0 0 0 23.73 2.56C158.31 137.88 172 122.37 172 104c0-22.06-19.74-40-44-40"
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
