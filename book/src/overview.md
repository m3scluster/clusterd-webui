# Overview and Live Metrics

The dashboard is the landing page after sign-in.

## Cluster header

The header shows cluster name, hostname, Mesos version, leader, and manager uptime. **Leader elected** indicates a healthy elected leader; otherwise a warning status is shown.

## Workloads

The four counters link to the corresponding views: active agents, active frameworks, running tasks, and failed tasks. Each card also provides related unreachable, connected, pending, or finished counts.

## Cluster capacity

CPU, memory, disk, and GPU cards show utilization, used amount, and total capacity with progress bars. Units and formatting are derived from Mesos resources.

## Live agent utilization heatmap

The heatmap aggregates available agent metrics. Unreachable agents are not represented as zeroes; missing values are shown as a dash so communication failures cannot look like free capacity.

## Control-plane monitoring

Monitoring cards include queued messages, outstanding offers, allocator p95 latency, dispatches, system load, and dropped messages. They describe the queried manager and are not a historical time series.

The page refreshes automatically. If a refresh fails, the last successful snapshot remains visible and the warning includes the reason.
