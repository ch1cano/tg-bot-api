run: 
	docker run -d -v logs:/app/data --rm --name logsapp logsapp:volumes

stop: 
	docker stop tg-bot-api-weather
