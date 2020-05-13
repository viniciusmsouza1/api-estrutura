docker run --name postgres \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin123 \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres

docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
    -d \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

docker exec -it mongodb \
    mongo --host localhost -u admin -p admin123 --authenticationDatabase admin \
    --eval "db.getSiblingDB('heroes').createUser({user: 'vmsouza', pwd: 'admin123', roles: [{role: 'readWrite', db: 'heroes'}]})"

docker exec -it 0b26d1557bb9 mongo -u vmsouza -p admin123 --authenticationDatabase heroes
