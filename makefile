setup:
	docker-compose up -d
	yarn
	cd backend/user-profiler && yarn
	cd backend/user-profiler && cat .env.example > .env
	cd backend/reservation && yarn
	cd backend/reservation && cat .env.example > .env
	cd frontend/register && yarn

dev:
	yarn dev