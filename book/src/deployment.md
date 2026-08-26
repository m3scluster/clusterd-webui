# Installation and Deployment

## Production build

Build the WebUI with Node/Yarn:

```bash
make build
```

The artifact is generated in `ui/build/`. `index.html` remains at the WebUI root and JavaScript/CSS are placed below `app/static/` for the ClusterD server layout.

Example installation on a master:

```bash
sudo install -d /usr/share/mesos/webui2
sudo cp -a ui/build/. /usr/share/mesos/webui2/
```

Configure the master to use `/usr/share/mesos/webui2`. Hash routes are handled in the browser; the part after `#` is not sent to the HTTP server.

## Local development

```bash
make serve
```

The development server is available at `http://localhost:3000/#/` and proxies to `https://devtest.lab.internal:5050` by default. Use another master without changing source code:

```bash
make serve CLUSTERD_PROXY_TARGET=https://master.example:5050
```

## Documentation build

Build this mdBook from the repository root:

```bash
make book
```

The output is written to `book/build/`. Use `make book-serve` to view it locally.

## Documentation deployment

`make deploy` builds the book, copies the output into a temporary `gh-pages` worktree, stages the result, and pushes only after a successful local build. An unchanged build is a successful no-op.

```bash
make deploy
```

The deploy target requires a configured Git remote and push permission. A successful build is **not** the same as a published deployment; publication requires the actual push.
