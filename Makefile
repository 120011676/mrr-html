build:
	docker build -t 120011676/mrr-html:lastest .
push:
	docker push 120011676/mrr-html:lastest
run: build
	docker-compose up --build