import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TasksDetails from '../../dialogs/detail.js';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import * as React from 'react';
import { FormatTimeDifference, StateBadge, HealthBadge } from "../../libs/functions";
import "../../app/App.css";

export default function TasksTable({tasks, title}) {
  const data = tasks;
  const [openRows, setOpenRows] = useState({}); // Zustand pro Task-ID

  const toggleRow = (id) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const Row = ({row}) =>  {
    const open = !!openRows[row.id];

    return (
        <React.Fragment>
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => toggleRow(row.id)}>
                 {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </IconButton>
              </TableCell>
              <TableCell>{row.framework_id}</TableCell>
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role ?? []}</TableCell>
              <TableCell><StateBadge state={row.state} /></TableCell>
              <TableCell>
                <HealthBadge
                  health=
                         {(() => {
                           const lastState = row.statuses?.at(-1);
                           if (lastState?.state === "TASK_RUNNING") {
                             return row.statuses?.at(-1).healthy ? "Healthy" : "Unhealthy";
                           }
                           return null;
                         })()}
                />
              </TableCell>
              <TableCell>{FormatTimeDifference(row.statuses?.at(-1).timestamp)}</TableCell>
              <TableCell>{row.hostname}</TableCell>
              <TableCell>
                <a href="#/agents/{{row.slave_id}}/frameworks/{{row.framework_id}}/executors/{{row.executor_id}}/tasks/{{row.id}}/browse">Sandbox</a>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: "100px" }} colSpan={5}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                   <TasksDetails key={row.id} data={row} />
               </Collapse>
              </TableCell>
            </TableRow>
         </React.Fragment>
    );
  };

  return (
    <TableContainer component={Paper}>
      <h4>{title}</h4>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Framework ID</TableCell>
            <TableCell>Task ID</TableCell>
            <TableCell>Task Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Health</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Host</TableCell>
            <TableCell>Sandbox</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>    
  );
}
