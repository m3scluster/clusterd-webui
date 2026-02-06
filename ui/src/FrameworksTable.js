import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FrameworksDetails from './dialogs/detail.js';
import { useState } from 'react';
import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { FormatTimeDifference, StateBadge } from "./libs/functions";

export default function FrameworksTable({frameworks, title}) {
  const data = frameworks;

  const Row = ({row}) =>  {
    const [open, setOpen] = useState(false);  

    return (
        <React.Fragment>
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >

              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.hostname}</TableCell>
              <TableCell>{row.user}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.roles}</TableCell>
              <TableCell>{row.principal}</TableCell>
              <TableCell></TableCell>
              <TableCell>{row.resources.cpus}</TableCell>
              <TableCell>{row.resources.gpus}</TableCell>
              <TableCell>{row.resources.mem}</TableCell>
              <TableCell>{row.resources.disk}</TableCell>
              <TableCell></TableCell>
              <TableCell>{FormatTimeDifference(row.registered_time)} ago</TableCell>
            </TableRow>
         </React.Fragment>
    );
  };
  

  return (
    <div>
    <TableContainer component={Paper}>
        <h4>{title}</h4>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>Active Tasks</TableCell>
              <TableCell>CPUs</TableCell>
              <TableCell>GPUs</TableCell>
              <TableCell>Mem</TableCell>
              <TableCell>Disk</TableCell>
              <TableCell>Max Share</TableCell>
              <TableCell>Registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {data.map((row) => (
            <Row key={row.id} row={row} />
          ))}
          </TableBody>
        </Table>
      </TableContainer>    
    </div>
  );
}
