# ClusterD/Apache Mesos WebUI

<a href="https://matrix.to/#/#mesos:matrix.aventer.biz" target="_new"><img src="https://img.shields.io/static/v1?label=Chat&message=Matrix&color=brightgreen"></a></span></a>
<a href="https://www.aventer.biz" target="_new"><img src="https://img.shields.io/static/v1?label=Support&message=AVENTER&color=brightgreen"></a></span></a>

This project is a **React-based WebUI** for Apache Mesos/ClusterD. It is
modular, easy toextend, and uses react.

## Funding

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=H553XE4QJ9GJ8)


---

## Features

- **Agents Management**
  - Display all agents in a table
  - Detailed information about resources, status, and IPs

- **Frameworks Management**
  - Overview of registered frameworks
  - Monitor resources and statuses

- **Tasks Management**
  - Display all tasks with status history
  - Detail view in a dialog

---

## Installation

1. Clone the repository and build the webui.

```bash
git clone <repo-url>
cd <project-folder>
make build
```

2. Copy `ui/app` on all ClusterD/Apache Mesos Master servers.

3. Change ClusterD/Apache Mesos Master configuration. As example:


```bash
vim /etc/mesos-master/webui_dir
/usr/share/mesos/webui2
```

## Screenshots

![clipboard_20260207150054.bmp](vx_images/clipboard_20260207150054.bmp)
![clipboard_20260207150113.bmp](vx_images/clipboard_20260207150113.bmp)


