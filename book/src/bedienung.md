# Sign-in and Navigation

## Sign-in

The sign-in page requests a username and password. Credentials are verified directly by the ClusterD master and are kept only for the current tab session. Invalid or expired credentials produce an error and require another sign-in.

The UI does not perform cluster administration. It displays data and uses the designated authenticated endpoints for logs, sandbox browsing, and the task shell.

## Main navigation

| Tab | Purpose |
| --- | --- |
| **Overview** | Cluster summary and live metrics |
| **Tasks** | Active, unreachable, and completed tasks |
| **Frameworks** | Active, inactive, and completed frameworks |
| **Offers** | Current resource offers by framework and agent |
| **Agents** | Registered Mesos agents and resources |
| **Manager details** | ClusterD managers, leader/follower status, metrics, and logs |

The tabs use hash routes, so routes such as `#/tasks` and `#/agents` can be opened directly. The legacy `#/index.html` route remains an alias for the overview.

## Interaction patterns

- Click a table row to open its details; focused rows also support **Enter** and **Space**.
- Long IDs use a monospace font and wrap where necessary.
- Close dialogs with **Close** or the close icon.
- Refresh failures are shown as warnings without discarding the last successful snapshot.
- Empty, loading, and error states are distinct and should not be confused with missing permissions.
