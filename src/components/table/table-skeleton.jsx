import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function TableSkeleton({ image = true, numberColum, ...other }) {
  return (
    <TableRow {...other}>
      {image && (
        <TableCell sx={{ display: 'flex', alignItems: 'center' }} colSpan={9}>
          <Stack spacing={3} direction="row">
            <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
            {numberColum === 0 && <Skeleton variant="text" width={100} height={20} />}
          </Stack>
        </TableCell>
      )}
      {[...Array(numberColum)].map((_, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width={100} height={20} />
        </TableCell>
      ))}
    </TableRow>
  );
}
