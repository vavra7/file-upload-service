# TODO: if yarn is not installed

dev:
	docker-compose -f docker-compose.dev.yaml up -d --force-recreate
	npx concurrently \
		'cd packages/server && yarn dev' \
		'cd packages/client && yarn dev'

dev-down:
	docker-compose -f docker-compose.dev.yaml down