import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
// import { varAlpha } from 'src/theme/styles';
import { BASE_LMS_API } from 'src/config-global';

// import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableFiltersResult } from '../user-table-filters-result';
import { ProductAttributeTableRow } from '../productAttribute-table-row';
import { ProductAttributeNewEditForm } from '../productAttribute-new-edit-form';
import { ProductAttributeTableToolbar } from '../productAttribute-table-toolbar';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: '#number', label: '#' },
  { id: 'name', label: 'نام' },
  { id: 'icon', label: 'ایکون' },
  { id: 'options', width: 88 },
  // { id: 'status', label: 'Status', width: 100 },
];

// ----------------------------------------------------------------------

export function ProductAttributeListView({ ProductId }) {
  const table = useTable();
  const t = fa;

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleOpenModal = (data = null) => {
    setEditData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setOpenModal(false);
  };
  const mounted = useIsMountedRef();
  const getProductAttributes = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/product-attributes/${ProductId}`,
      callback: (status, data) => {
        if (status) {
          setTableData(data.data);
        }
      },
    });
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsLoading(true);
      getProductAttributes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filters = useSetState({ name: '', role: [], status: 'all' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      const afterDelete = tableData.filter((row) => row.id !== id);
      const DeleteItem = tableData.filter((row) => row.id === id);
      AxiosComponent({
        method: 'delete',
        url: `${BASE_LMS_API}/product-attribute/${DeleteItem[0].id}`,
        callback: (status, data) => {
          if (status) {
            toast.success(t.dashboard.tableCommon.mesDelete);
            setTableData(afterDelete);
          }
        },
      });
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      const rowData = tableData.find((row) => row.id === id);
      handleOpenModal(rowData);
    },
    [tableData]
  );
  const denseHeight = table.dense ? 56 : 76;

  // const handleFilterStatus = useCallback(
  //   (event, newValue) => {
  //     table.onResetPage();
  //     filters.setState({ status: newValue });
  //   },
  //   [filters, table]
  // );
  const labelDisplayedRows = ({ from, to, count }) =>
    `${from}–${to} از ${count !== -1 ? count : `${to}`}`;
  return (
    <>
      <Box sx={{ mt: 5 }}>
        <CustomBreadcrumbs
          heading={t.dashboard.pages.productAttribute}
          // heading={true ? t.store.common.edit : t.store.common.create}
          links={[{}]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => handleOpenModal(null)}
            >
              {t.store.common.create}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProductAttributeTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: ['roles'] }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, index) => (
                      <TableSkeleton
                        key={index}
                        image={false}
                        numberColum={3}
                        count={new Array(4).fill(0)}
                        sx={{ height: denseHeight }}
                      />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row, index) => (
                          <ProductAttributeTableRow
                            key={row.id}
                            rowCount={index}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                      />
                      <TableNoData notFound={notFound} />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            labelRowsPerPage={t.dashboard.tableCommon.rowPerPage}
            labelDisplayedRows={labelDisplayedRows}
          />
        </Card>
      </Box>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xl"
        sx={{ '& .MuiDialog-paper': { minHeight: '50vh', maxHeight: '90vh' } }}
      >
        <DialogTitle>
          {editData ? t.store.common.edit : t.store.common.create}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            X
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProductAttributeNewEditForm
            currentAttributes={editData}
            onSuccess={handleCloseModal}
            getProductAttributes={getProductAttributes}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            {t.store.common.cancel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
