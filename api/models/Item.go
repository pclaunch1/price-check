package models

type Item struct {
	Date string `json:"date"`
	Id string `json:"id"`
	ImageUrls []string `json:"imageUrls" dynamodbav:"imageUrls"`
	Price int `json:"price"`
	PurchaseUrl string `json:"purchaseUrl"`
	Title string `json:"title"`
}