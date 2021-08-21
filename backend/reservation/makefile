dev:
	@cat .env.example > .env
	yarn dev

deploy:
	docker build -t backend-image .
	docker-compose up -d