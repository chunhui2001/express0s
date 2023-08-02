
### 当前 Makefile 文件物理路径
ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

APP_NAME 	?=express0s
#e 			?=local
zone 		?=UTC
#zone 		?=Asia/Shanghai

list:
	npm list -g --depth=0

clear:
	rm -rf dist

prune: clear
	rm -rf node_modules

install:
	npm i

compile:
	npx tsc

run: clear compile
	export TZ=$(zone) && node ./dist/main.js

serve:
	npm i --prefix /app/$(APP_NAME) && npm run start --prefix /app/$(APP_NAME)


### https://registry.npmjs.org/express0s
publish:
	rm -rf dist && npx tsc
	npm login && npm publish --access public
