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

### How to start dev ?
```
make setup
make dev
```
### ROLE
- User role master admin (all permission) manage admin of centre, add centre and create user admin
- User role admin, add many branch belong to centre, add nurse into branch, add capacity for each branch
- User role nurse with auto assign reservation submitted from user (who wish to be vaccinated)
- Customer who wish to be vaccinated and submitted form

### AUTO ASSIGN RESERVATION INTO BRANCH AND NURSE
```
Main focus: round robin
Explanation: If no branch has received registration yet, randomly select 1 branch and randomly select 1 nurse. If there is already a branch that accepts registration, select the branch with the least reservation and select the nurse with the least reservation to assign.
Detail at => backend/reservation/src/workers/reservation.js
```

### Services Dependencies
<img src="https://i.ibb.co/N1n07V9/Vaccine-reservation.jpg" height="600" width="800" hspace="40">

### Sequence Diagram
<img src="https://i.ibb.co/Rp1CMtN/Untitled.png" height="1500" width="800" hspace="40">
