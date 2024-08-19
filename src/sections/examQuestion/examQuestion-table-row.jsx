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

export function SubMenuTableRow({
  row,
  selected,
  rowCount,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onQuestionOptionsRow,
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
              {row.question}
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.exam_name}
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="اضافه کردن جواب" placement="top" arrow>
              <IconButton
                onClick={() => {
                  onQuestionOptionsRow();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 1200 1200"
                >
                  <path
                    fill="gray"
                    d="M0 0v1200h1200V424.289l-196.875 196.875v381.961h-806.25v-806.25h381.961L775.711 0zm1030.008 15.161l-434.18 434.25L440.7 294.283L281.618 453.438L595.821 767.57l159.082-159.082l434.18-434.25l-159.082-159.081z"
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
