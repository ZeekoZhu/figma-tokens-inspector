PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS = -ec

node_modules: package.json yarn.lock
	yarn install --frozen-lockfile

dev:
	@vite

crx: node_modules
	@vite build --mode production
	if [ ! -d ./dist ]; then
		mkdir dist
	fi
	crx pack extension -o dist/extension.crx

start-chromium:
	@web-ext run --source-dir extension --target chromium \
		--no-reload \
		--keep-profile-changes \
		--profile-create-if-missing \
		--chromium-profile ./.cache/chromium-profile

clean:
	@rm -rf dist
