
### 当前 Makefile 文件物理路径
ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

APP_NAME 	?=express0s
#e 			?=local
zone 		?=UTC
#zone 		?=Asia/Shanghai

list:
	npm list -g --depth=0

prune:
	rm -rf dist
	rm -rf node_modules

install:
	npm i && npx tsc

run:
	rm -rf dist && npx tsc
	export TZ=$(zone) && node ./dist/main.js

re-build:
	docker run --rm -it -v $(PWD):/$(APP_NAME):rw --name build_$(APP_NAME) chunhui2001/chunhui2001/alpine:3.9.node_12.18.3 /bin/bash -c 'make -f /$(APP_NAME)/Makefile prune install' -m 4g

rm:
	docker rm -f $(APP_NAME) >/dev/null 2>&1

up: rm
	docker-compose -f docker-compose.yml up -d
	docker logs -f $(APP_NAME)

serve:
	npm i --prefix /app/$(APP_NAME) && npm run start --prefix /app/$(APP_NAME)


### https://registry.npmjs.org/express0s
publish:
	rm -rf dist && npx tsc
	npm login && npm publish --access public
