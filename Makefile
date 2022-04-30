PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS = -ec

browser ?= chromium

build: ts
	export TARGET=$(browser)
	vite build

node_modules: package.json yarn.lock
	yarn install --frozen-lockfile

ts: node_modules
	tsc

dev: ts
	export TARGET=$(browser)
	vite dev

validate: build
	web-ext lint -s dist
