# Tasks

The **Tasks** tab separates **Active Tasks**, **Unreachable Tasks**, and **Completed Tasks**. Terminal states are not duplicated in the active table.

## Search and details

The search field filters all task states by task name or task ID. Click a row to open task details; framework and agent IDs are links inside the dialog.

## Task details

The dialog includes state, health, role, status count, task/framework/agent/host/executor information, container type, resources and limits, chronological status history, and expandable **Advanced container data**.

For running containers, **View task logs**, **Open task shell**, and **Open sandbox** may be available. Buttons remain disabled when agent or container information is missing.

## Interactive task shell

The shell is opened as a nested agent-container session. Select a shell program and send authenticated input to the agent. Closing the dialog aborts the session, so commands do not continue invisibly after the dialog is closed.
