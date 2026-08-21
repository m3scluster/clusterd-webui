.PHONY: serve build

CLUSTERD_PROXY_TARGET ?= https://devtest.lab.internal:5050

all: serve

serve:
	cd ui && yarn install && CLUSTERD_PROXY_TARGET="$(CLUSTERD_PROXY_TARGET)" yarn start

build:
	cd ui && yarn build

