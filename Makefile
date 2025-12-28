IMAGE_NAME = aloha-backend
CONTAINER_NAME = aloha-backend-container

.PHONY: build run dev-run stop clean

build:
	docker build -t $(IMAGE_NAME) ./backend

run:
	docker run --rm -d \
		--name $(CONTAINER_NAME) \
		-p 8000:8000 \
		-v "$(CURDIR)/aloha.db":/app/aloha.db \
		$(IMAGE_NAME)

dev-run:
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-p 8000:8000 \
		-v "$(CURDIR)/backend":/app \
		-v "$(CURDIR)/aloha.db":/app/aloha.db \
		$(IMAGE_NAME) \
		uvicorn main:app --host 0.0.0.0 --port 8000 --reload

stop:
	docker stop $(CONTAINER_NAME)

clean:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	docker rmi $(IMAGE_NAME) || true
