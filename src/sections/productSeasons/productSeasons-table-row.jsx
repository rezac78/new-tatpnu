import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
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

export function UserProductsTableRow({
  row,
  selected,
  rowCount,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onEditSectionRow,
}) {
  const confirm = useBoolean();
  const t = fa;

  const popover = usePopover();

  const quickEdit = useBoolean();
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell className="!font-digit w-10">{rowCount + 1}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.title}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.products?.title}</TableCell>
        {/* <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell> */}
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="ساخت بخش" placement="top" arrow>
              <IconButton
                onClick={() => {
                  onEditSectionRow();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                  <path
                    fill="gray"
                    d="M11 9V5H9v4H5v2h4v4h2v-4h4V9zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20"
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
