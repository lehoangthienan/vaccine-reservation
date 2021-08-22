# vaccine-reservation
vaccine-reservation

### Dependencies
|Dependency    |Version |
|--------------|--------|
|Node.js       |latest  |
|npm           |latest  |
|Express       |latest  |
|MongoDB       |latest  |
|Mongoose      |latest  |
|RabbitMQ      |latest  |

### Architecture
- Micro service architecture with simple software architecture (unrelated but Clean architecture at here https://github.com/lehoangthienan/marvel-heroes-backend)

### How to start dev ?
```
make setup
make dev
```

### Register FE
- Simple FE, access to:
```
http://localhost:3002
```

### ROLE
- User role master admin (all permission) manage admin of centre, add centre and create user admin
- User role admin, add many branch belong to centre, add nurse into branch, add capacity for each branch
- User role nurse with auto assign reservation submitted from user (who wish to be vaccinated)
- Customer who wish to be vaccinated and submitted form

### AUTO ASSIGN RESERVATION INTO BRANCH AND NURSE
```
Main focus: round robin
Explanation: If no branch has received registration yet, randomly select 1 branch and randomly select 1 nurse. If there is already a branch that accepts registration, select the branch with the least reservation and select the nurse with the least reservation to assign. If the capacity for today is exhausted, the reservation will be carried over to the next day.
Detail at => backend/reservation/src/workers/reservation.js
```
### Resource contention
```
Use transaction of MongoDB > 4.0
```

### POSTMAN
```
https://www.getpostman.com/collections/ff7b9533a8931b1dba3f
```

### Services Dependencies
<img src="https://i.ibb.co/N1n07V9/Vaccine-reservation.jpg" height="600" width="800" hspace="40">

### Sequence Diagram
<img src="https://i.ibb.co/Rp1CMtN/Untitled.png" height="1500" width="800" hspace="40">
