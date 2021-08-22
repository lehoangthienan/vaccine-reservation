rabbitmq-plugins enable rabbitmq_management

mongodump -d reservation -o ./
mongodump -d user-profiler -o ./

mongorestore -h localhost:27017  -d reservation --drop --batchSize=100 ./reservation
mongorestore -h localhost:27017  -d user-profiler --drop --batchSize=100 ./user-profiler