.PHONY: serve build

CLUSTERD_PROXY_TARGET ?= https://devtest.lab.internal:5050
VERSION ?= 0.2.0

all: serve

serve:
	cd ui && yarn install --production=false && CLUSTERD_PROXY_TARGET="$(CLUSTERD_PROXY_TARGET)" REACT_APP_VERSION="$(VERSION)" yarn start

build:
	cd ui && REACT_APP_VERSION="$(VERSION)" yarn build

