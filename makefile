setup:
	docker-compose up -d
	docker exec -it mongo-db bash -c "mongorestore -h localhost:27017  -d reservation --drop --batchSize=100 /data/dump/reservation && mongorestore -h localhost:27017  -d user-profiler --drop --batchSize=100 /data/dump/user-profiler"
	docker exec -it rabbitmq bash -c "rabbitmq-plugins enable rabbitmq_management"
	yarn
	cd backend/user-profiler && yarn
	cd backend/user-profiler && cat .env.example > .env
	cd backend/reservation && yarn
	cd backend/reservation && cat .env.example > .env
	cd frontend/register && yarn

dev:
	yarn dev