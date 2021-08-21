dev:
	@cat .env.example > .env
	yarn dev

deploy:
	docker build -t user-profiler-image .
	docker-compose up -d