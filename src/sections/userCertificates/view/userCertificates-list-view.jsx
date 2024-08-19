import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Menu, MenuItem } from '@mui/material';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
// import { varAlpha } from 'src/theme/styles';
import { BASE_LMS_API } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

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
import { UserCertificatesTableRow } from '../userCertificates-table-row';
import { UserCertificatesTableToolbar } from '../userCertificates-table-toolbar';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: '#number', label: '#' },
  { id: 'userName', label: 'نام' },
  { id: 'userMobile', label: 'تلفن' },
  { id: 'options', width: 88 },
  // { id: 'status', label: 'Status', width: 100 },
];

// ----------------------------------------------------------------------

export function UserCertificatesListView() {
  const table = useTable();
  const t = fa;

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setOpen] = useState(null);
  const mounted = useIsMountedRef();
  const getUserCertificates = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/user-certificates`,
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
      getUserCertificates();
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
        url: `${BASE_LMS_API}/user-certificates/${DeleteItem[0].id}`,
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
      router.push(paths.dashboard.userCertificates.edit(id));
    },
    [router]
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
  const handleOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t.store.common.create}
          // heading={true ? t.store.common.edit : t.store.common.create}
          links={[
            { name: t.dashboard.title, href: paths.dashboard.root },
            {
              name: t.dashboard.pages.userCertificates,
              href: paths.dashboard.userCertificates.list,
            },
            { name: t.dashboard.tableCommon.list },
          ]}
          action={
            <>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleOpen}
              >
                {t.store.common.create}
              </Button>
              <Menu id="simple-menu" anchorEl={isOpen} open={isOpen}>
                <MenuItem>
                  <Button href={paths.dashboard.userCertificates.new}>
                    {t.dashboard.tableCommon.createForm}
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button href={paths.dashboard.userCertificates.newExcel}>
                    {t.dashboard.tableCommon.createFormExcel}
                  </Button>
                </MenuItem>
              </Menu>
            </>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <UserCertificatesTableToolbar
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
                          <UserCertificatesTableRow
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
      </DashboardContent>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
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
