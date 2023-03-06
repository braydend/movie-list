package mongo

import (
	"context"
	"fmt"
	"github.com/braydend/movie-list/server/utils"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

func createInstance() *mongo.Client {
	username := utils.GetEnvVar("MONGO_DB_USERNAME")
	password := utils.GetEnvVar("MONGO_DB_PASSWORD")

	serverAPIOptions := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().
		ApplyURI(fmt.Sprintf("mongodb+srv://%s:%s@movielist.3cizhk9.mongodb.net/?retryWrites=true&w=majority", username, password)).
		SetServerAPIOptions(serverAPIOptions)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	return client
}

func getDatabase() *mongo.Database {
	dbName := utils.GetEnvVar("DATABASE_NAME")
	client := createInstance()
	db := client.Database(dbName)

	return db
}
