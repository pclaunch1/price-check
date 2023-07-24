build:
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o api/build/bootstrap api/cmd/main.go
	zip -jrm api/build/bootstrap.zip api/build/bootstrap