package main

import (
	"context"
	"flag"
	"log"

	pb "github.com/raferreira96/client-go/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	addr = flag.String("addr", "localhost:50051", "the address to connect to")
)

func main() {
	conn, err := grpc.NewClient(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatalf("Could not connect: %v", err)
	}

	defer conn.Close()

	client := pb.NewStockPriceServiceClient(conn)

	feature, err := client.GetPrice(context.Background(), &pb.StockPriceRequest{Symbol: "AAPL"})

	if err != nil {
		log.Fatalf("Could not get price: %v", err)
	}

	log.Printf("Price of AAPL: %v", feature.Price)
}
