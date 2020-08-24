check-requirements:
ifeq (, $(shell which node))
	$(error "node needs to be installed")
endif
ifeq (, $(shell which npm))
	$(error "npm needs to be installed")
endif
ifeq (, $(shell which yarn))
	$(error "yarn needs to be installed")
endif
	@echo "Requirements are fine"


dev: check-requirements
ifeq (,$(wildcard ./node_modules))
	yarn
endif
	npx concurrently \
		'cd packages/server && yarn dev' \
		'cd packages/client && yarn dev'


dev-down:
	docker-compose -f docker-compose.dev.yaml down