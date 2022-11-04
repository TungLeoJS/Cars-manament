###DEV

build-dev:
	sudo docker-compose -f docker-compose.dev.yaml build

run-dev:
	sudo docker-compose -f docker-compose.dev.yaml up -d

build-prod:
	sudo docker-compose -f docker-compose.prod.yaml build

run-prod:
	sudo docker-compose -f docker-compose.prod.yaml up -d
### REMOTE
SSH_STRING:=root@165.22.54.199
ssh:
	ssh $(SSH_STRING)

copy-files:
	scp -r ./* $(SSH_STRING):./