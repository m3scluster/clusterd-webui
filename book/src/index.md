# ClusterD WebUI

The new ClusterD WebUI is a responsive React interface for Apache Mesos clusters. It brings cluster state, workloads, resources, and diagnostics together in one interface.

![Cluster overview in dark mode](images/clusterd-webui-slideshow.gif)

> This is an animated recording of the running WebUI. Values and hostnames are runtime examples, not configuration requirements.

## Highlights

- **Dashboard:** cluster state, leader status, workload counters, capacity, and control-plane metrics.
- **Live updates:** data is refreshed every five seconds by default. When a refresh fails, the last successful snapshot remains visible.
- **Detail views:** tasks, frameworks, agents, and managers are shown as structured information instead of raw JSON.
- **Related navigation:** task details link directly to the related framework and agent.
- **Diagnostics:** bounded log tails, sandbox browsing, and an interactive task shell where agent and container data is available.
- **Light/dark mode:** switch the color scheme with the sun icon.

## Quick start

1. Sign in at the WebUI URL.
2. On **Overview**, check that a leader has been elected.
3. Open **Tasks**, **Frameworks**, **Offers**, **Agents**, or **Manager details** for deeper analysis.
4. Click a table row to open its detail view.

Continue with [Sign-in and Navigation](bedienung.md).
