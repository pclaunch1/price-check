package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CurrentChallenge struct {
    Id string `json:"id"`
    ImageUrls []string `json:"imageUrls"`
}

type Submission struct {
    PriceGuess int `json:"priceGuess"`
    AttemptCount int `json:"attemptCount"`
}

type Result struct {
    Result string `json:"itemID"`
    Suggestion string `json:"imageUrls"`
}

var ginLambda *ginadapter.GinLambda
var svc *dynamodb.Client

func init() {
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(opts *config.LoadOptions) error {
		opts.Region = "us-east-1"
		return nil
	})
	if err != nil {
		panic(err)
	}

	svc = dynamodb.NewFromConfig(cfg)
	
    r := gin.Default()

	r.Use(cors.New(cors.Config{
	 AllowOrigins:     []string{"http://price-check-prod.s3-website-us-east-1.amazonaws.com"},
	 AllowMethods:     []string{"PUT", "PATCH"},
	 AllowHeaders:     []string{"Origin"},
	 ExposeHeaders:    []string{"Content-Length"},
	 AllowCredentials: true,
	 AllowOriginFunc: func(origin string) bool {
	  return origin == "http://price-check-prod.s3-website-us-east-1.amazonaws.com"
	 },
	 MaxAge: 12 * time.Hour,
	}))

	// r.POST("/challenge", HandlePostItem)
	// r.Get("/challenge", HandleListItems)
	// r.Put("/challenge/{id}", HandlePutItem)
	// r.GET("/challenge/{id}", HandleGetItem)
    // r.POST("/challenge/{id}/guess", HandleChallengeGuess)
	r.GET("/challenge/today", HandleCurrentChallenges)

    ginLambda = ginadapter.New(r)
}

func lambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
    c, err := ginLambda.ProxyWithContext(ctx, req)

    return c, err
}

func main() {
    lambda.Start(lambdaHandler)
}

func HandleCurrentChallenges(c *gin.Context) {
    tableName := "challenges"
    today := time.Now().Format("2006-01-02")

	keyExpr := expression.Key("date").Equal(expression.Value(today)) 
	expr, err := expression.NewBuilder().WithKeyCondition(keyExpr).Build()
    if err != nil {
        log.Fatalf(fmt.Sprintf("Failed to build expression, %v", err))
        c.JSON(http.StatusInternalServerError, err)
    }
    
    result, err := svc.Query(c, &dynamodb.QueryInput{
        TableName: aws.String(tableName),
		IndexName: aws.String("date-id-index"),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
        KeyConditionExpression: expr.KeyCondition(),
    })
    if err != nil {
        log.Fatalf("Got error calling GetItem: %s", err)
        c.JSON(http.StatusNotFound, err)
    }

    if result.Items == nil{
        log.Fatalf("Could not find challenge for today")
        c.JSON(http.StatusNotFound, err)
    }

	type Response struct {
		Id string `json:"id"`
		ImageUrls []string `json:"imageUrls"`
	}
    
    var items *[]Response
    
    err = attributevalue.UnmarshalListOfMaps(result.Items, &items)
    if err != nil {
        log.Fatalf(fmt.Sprintf("Failed to unmarshal Record, %v", err))
        c.JSON(http.StatusInternalServerError, err)
    }
	
	c.JSON(http.StatusOK, items)
}

// func HandleChallengeGuess(c *gin.Context) {
//     tableName := "challenges"
// 	id := chi.URLParam(r, "id")

//     var reqBody *Submission
//     err := json.NewDecoder(r.Body).Decode(&reqBody)
//     if err != nil {
//         log.Fatalf("Unmarshalling error: %s", err)
//         http.Error(w, http.StatusText(500), 500)
//     }
    
//     challenge, err := svc.GetItem(r.Context(), &dynamodb.GetItemInput{
//         TableName: aws.String(tableName),
// 		Key: map[string]types.AttributeValue{
// 			"id": &types.AttributeValueMemberS{Value: id},
// 		},
//     })
//     if err != nil {
//         log.Fatalf("Got error calling GetItem: %s", err)
//         http.Error(w, http.StatusText(500), 500)
//     }

//     if challenge.Item == nil{
//         log.Fatalf("Could not find challenge for today")
//         http.Error(w, http.StatusText(400), 400)
//     }
    
//     var item *models.Item
    
//     err = attributevalue.UnmarshalMap(challenge.Item, &item)
//     if err != nil {
//         log.Fatalf(fmt.Sprintf("Failed to unmarshal Record, %v", err))
//         http.Error(w, http.StatusText(500), 500)
//     }

//     result := Result {
//         Result: "Incorrect",
//         Suggestion: "Go Lower",
//     }

//     if reqBody.PriceGuess == item.Price {
//         result = Result{
//             Result: "Correct",
//             Suggestion: "Nice Job!",
//         }
// 		utils.RespondWithJSON(w, 200, result)
//     }

//     if reqBody.PriceGuess < item.Price {
//         result = Result{
//             Result: "Incorrect",
//             Suggestion: "Go Higher",
//         }
// 		utils.RespondWithJSON(w, 200, result)
//     }

// 	utils.RespondWithJSON(w, 200, result)
// }

// func HandlePostItem(c *gin.Context) {
//     tableName := "challenges"

// 	var item *models.Item
//     err := json.NewDecoder(r.Body).Decode(&item)
//     if err != nil {
//         log.Fatalf("Unmarshalling error: %s", err)
//         http.Error(w, http.StatusText(500), 500)
//     }

// 	av, err := attributevalue.MarshalMap(item)
//     if err != nil {
//         log.Fatalf("Error marshalling to attributevalues: %s", err)
//         http.Error(w, http.StatusText(500), 500)
//     }
    
//     result, err := svc.PutItem(r.Context(), &dynamodb.PutItemInput{
//         TableName: aws.String(tableName),
//         Item: av,
//     })
//     if err != nil {
//         log.Fatalf("Got error calling PutItem: %s", err)
//         http.Error(w, http.StatusText(500), 500)
//     }

// 	utils.RespondWithJSON(w, 200, result)
// }

// func HandleGetItem(c *gin.Context) {
//     tableName := "challenges"
// 	id := chi.URLParam(r, "id")
    
//     var challenge *models.Item
    
//     res, err := svc.GetItem(r.Context(), &dynamodb.GetItemInput{
//         TableName: aws.String(tableName),
// 		Key: map[string]types.AttributeValue{
// 			"id": &types.AttributeValueMemberS{Value: id},
// 		},
//     })
//     if err != nil {
//         log.Fatalf("Got error calling GetItem: %s", err)
//         http.Error(w, http.StatusText(500), 500)
//     }
    
//     err = attributevalue.UnmarshalMap(res.Item, &challenge)
//     if err != nil {
//         log.Fatalf(fmt.Sprintf("Failed to unmarshal Record, %v", err))
//         http.Error(w, http.StatusText(500), 500)
//     }

// 	utils.RespondWithJSON(w, 200, challenge)
// }
