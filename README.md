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

## Build and installation

1. Clone the repository and build the WebUI.

```bash
git clone <repo-url>
cd <project-folder>
make build
```

The deployable files are generated in `ui/build/`. The production build keeps
`index.html` at the WebUI root and places JavaScript and CSS below
`app/static/`, matching the routes exposed by the ClusterD/Mesos master.

2. Copy the **contents** of `ui/build/` to the configured WebUI directory on
every ClusterD/Apache Mesos master:

```bash
sudo install -d /usr/share/mesos/webui2
sudo cp -a ui/build/. /usr/share/mesos/webui2/
```

The resulting layout starts with:

```text
/usr/share/mesos/webui2/index.html
/usr/share/mesos/webui2/app/static/...
```

3. Configure the ClusterD/Apache Mesos master to use that directory, for
example:

```bash
vim /etc/mesos-master/webui_dir
/usr/share/mesos/webui2
```

After restarting the master, the UI is available through hash routes such as:

```text
https://master.example:5050/#/
https://master.example:5050/#/tasks
https://master.example:5050/#/frameworks
https://master.example:5050/#/agents
https://master.example:5050/#/master
```

The legacy `#/index.html` hash is accepted as an alias for the overview.

The part after `#` is a client-side UI route and is not sent to the HTTP
server. Assets therefore cannot be loaded "below `/#/`". Production builds
request them from `/app/static/`, the route exposed by the master for all
hashes. Development builds keep using the local React server. The
`view-source:` prefix is a browser command for displaying page
source and is not part of the deployment URL.

## Development

`make serve` starts the React development server and proxies ClusterD/Mesos API
requests to `https://devtest.lab.internal:5050`. This keeps browser requests
same-origin and avoids CORS errors; the development proxy accepts the master's
self-signed TLS certificate. Development remains available at
`http://localhost:3000/#/` and uses the same hash routes as production.

Use another master without changing the UI source:

```bash
make serve CLUSTERD_PROXY_TARGET=https://other-master.example:5050
```

The production build uses same-origin API URLs and is intended to be served by
the ClusterD master itself.

## WebUI slideshow

The slideshow was captured directly from the running WebUI. It demonstrates
the cluster overview, task and framework details, agents and their resources,
master information, and the light/dark color modes.

![ClusterD WebUI feature slideshow](docs/clusterd-webui-slideshow.gif)


