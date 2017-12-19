build:
	docker build -t 120011676/mrr-html:latest .
push: build
	docker push 120011676/mrr-html:latest
run: build
	docker-compose up --build