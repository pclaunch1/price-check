package main

import (
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"log"
)

type Challenge struct {
	Date string `json:"date"`
	Id string `json:"id"`
	ImageUrls []string `json:"imageUrls"`
	Price int `json:"price"`
	PurchaseUrl string `json:"purchaseUrl"`
	Title string `json:"title"`
}

var svc *dynamodb.DynamoDB

func init() {
    sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	
	// Create DynamoDB client
	svc = dynamodb.New(sess)
}

func HandleRequest() (*Challenge, error) {
	tableName := "challenges"
	date := "2023-07-23"

	var chal *Challenge

	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"date": {
				S: aws.String(date),
			},
		},
	})
	if err != nil {
		log.Fatalf("Got error calling GetItem: %s", err)
		return nil, err
	}

	dynamodbattribute.UnmarshalMap(result.Item, &chal)
	if err != nil {
		log.Fatalf("Got error unmarshallling: %s", err)
		return nil, err
	}

	return chal, nil
}

func main() {
	lambda.Start(HandleRequest)
}