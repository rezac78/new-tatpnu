import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

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

import { UserProductsTableRow } from '../productSeasons-table-row';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { UserProductsTableToolbar } from '../productSeasons-table-toolbar';
import { ProductSeasonsNewEditForm } from '../productSeasons-new-edit-form';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: '#number', label: '#' },
  { id: 'userName', label: 'نام' },
  { id: 'products', label: 'محصول' },
  { id: 'options', width: 88 },
];

// ----------------------------------------------------------------------

export function ProductSeasonsListView() {
  const table = useTable();
  const t = fa;
  const ID = useParams();

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
  const getUserProducts = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/product-season/admin/index/${ID.id}`,
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
      getUserProducts();
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
        url: `${BASE_LMS_API}/product-season/${DeleteItem[0].id}`,
        callback: (status, data) => {
          if (status) {
            toast.success(t.dashboard.tableCommon.mesDelete);
            setTableData(afterDelete);
          } else {
            toast.error(t.dashboard.tableCommon.mesDelete);
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
  const handleEditSectionRow = useCallback(
    (product_id) => {
      router.push(paths.dashboard.productSections.list(ID.id, product_id));
    },
    [ID.id, router]
  );
  const denseHeight = table.dense ? 56 : 76;
  const labelDisplayedRows = ({ from, to, count }) =>
    `${from}–${to} از ${count !== -1 ? count : `${to}`}`;
  return (
    <>
      <Box sx={{ mt: 5 }}>
        <CustomBreadcrumbs
          heading={`${t.dashboard.pages.productSeasons}`}
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
          <UserProductsTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: ["_roles"] }}
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
                        numberColum={3}
                        image={false}
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
                          <UserProductsTableRow
                            key={row.id}
                            rowCount={index}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onEditSectionRow={() => handleEditSectionRow(row.id)}
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
          <ProductSeasonsNewEditForm
            currentProduct={editData}
            onSuccess={handleCloseModal}
            getUserProducts={getUserProducts}
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
