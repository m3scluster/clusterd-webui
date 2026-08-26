# Logs, Sandbox, and Task Shell

## Logs

Task, agent, and manager logs are displayed in a dialog with a bounded tail. Depending on the log type, the stream, refresh, and auto-refresh behavior can be selected. Responses are decoded as UTF-8 and kept bounded to avoid blocking the browser.

## Sandbox

**Open sandbox** is available from task details when an agent is assigned. It browses a task's sandbox files. Missing agent or container information is shown explicitly rather than using an unsafe fallback.

## Operational boundaries

- Sign-in remains tied to the ClusterD session.
- Agent endpoints are validated for hostname, port, and supported path before use.
- The task shell requires identifiable agent and container information.
- Closing a shell triggers its abort signal.
- Coordinate diagnostic actions with cluster permissions and operating policies.
