.PHONY: serve

all: serve

serve:
	cd ui; yarn install; yarn start

build:
	cd ui; yarn build

