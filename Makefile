PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS = -ec

node_modules: package.json yarn.lock
	yarn install --frozen-lockfile

prepare: node_modules
	@esno ./scripts/prepare.ts
	cp -r src/assets/* extension/assets/

dev-pages: node_modules
	@vite

dev-content-script: node_modules
	@vite build --config vite.config.content.ts --mode development

dev:
	@vite

start-chromium:
	@web-ext run --source-dir extension --target chromium \
		--no-reload \
		--keep-profile-changes \
		--profile-create-if-missing \
		--chromium-profile ./.cache/chromium-profile
