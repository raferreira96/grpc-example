#!/bin/bash

protoc --go_out=./generated --go_opt=module=github.com/raferreira96/client-go --go-grpc_out=./generated --go-grpc_opt=module=github.com/raferreira96/client-go proto/stockprice.proto