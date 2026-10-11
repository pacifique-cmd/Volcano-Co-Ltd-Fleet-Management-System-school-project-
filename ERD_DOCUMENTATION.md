# Entity Relationship Diagram (ERD) - VCFMS

## ERD Description

The Volcano Co Ltd Fleet Management System uses a normalized relational database model with the following entities and relationships:

### Entities

#### 1. Vehicle
- **Primary Key**: vehicleID
- **Attributes**: vehicleID, plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity, status
- **Description**: Stores information about all vehicles in the fleet

#### 2. Driver
- **Primary Key**: driverID
- **Attributes**: driverID, firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID (FK)
- **Description**: Maintains driver profiles with license information
- **Relationships**: One-to-Many with Vehicle (One vehicle can have one active driver, but a driver may be reassigned)

#### 3. Client
- **Primary Key**: clientID
- **Attributes**: clientID, clientName, clientType, telephone, email, district
- **Description**: Stores client information
- **Relationships**: One-to-Many with Booking

#### 4. Booking
- **Primary Key**: bookingID
- **Attributes**: bookingID, bookingDate, startDate, endDate, destination, totalFare, paymentStatus, clientID (FK), vehicleID (FK), driverID (FK)
- **Description**: Records all vehicle bookings
- **Relationships**: Many-to-One with Client, Vehicle, and Driver

#### 5. Maintenance
- **Primary Key**: maintenanceID
- **Attributes**: maintenanceID, maintenanceDate, maintenanceType, cost, garage, description, vehicleID (FK)
- **Description**: Tracks maintenance records for vehicles
- **Relationships**: Many-to-One with Vehicle

#### 6. Staff
- **Primary Key**: staffID
- **Attributes**: staffID, username, password, email, role
- **Description**: User accounts for system access

### Relationships

```
Vehicle ─────────────────────────────── Driver
(1)                                     (Many)
  │
  │ (1)
  │
  └──────────────────────────────────── Booking
                                        (Many)
                                          │
                                          │ (Many)
                                          │
                                        Client
                                        (1)

Vehicle ─────────────────────────────── Maintenance
(1)                                     (Many)

Booking ─────────────────────────────── Driver
(Many)                                  (1)
```

### Cardinality Summary

| Relationship | Cardinality | Description |
|---|---|---|
| Vehicle - Driver | 1:N | One vehicle can be assigned to multiple drivers over time |
| Vehicle - Booking | 1:N | One vehicle can have many bookings |
| Vehicle - Maintenance | 1:N | One vehicle can have many maintenance records |
| Client - Booking | 1:N | One client can make many bookings |
| Driver - Booking | 1:N | One driver can complete many bookings |

### Key Constraints

- **Primary Keys**: Each entity has a unique primary key
- **Foreign Keys**: Maintain referential integrity across tables
- **Unique Constraints**: plateNumber (Vehicle), licenseNumber (Driver), username (Staff)
- **Not Null Constraints**: Applied to mandatory fields

### Data Types

| Field | Type | Example |
|---|---|---|
| IDs | INT AUTO_INCREMENT | 1, 2, 3... |
| Strings | VARCHAR(100-255) | "Toyota Camry" |
| Enums | ENUM | 'Available', 'Paid' |
| Dates | DATE | 2025-05-28 |
| Money | DECIMAL(10,2) | 150000.50 |
| Timestamps | TIMESTAMP | 2025-05-28 14:30:45 |

### Indexes

Indexes have been created on frequently queried fields:
- Vehicle.vehicleType
- Driver.status
- Booking.paymentStatus
- Booking.startDate, endDate

This improves query performance for filtering and reporting operations.

## Visual Representation (Text Format)

```
┌─────────────┐
│   Vehicle   │
├─────────────┤
│ vehicleID◆  │
│ plateNumber│
│ make       │
│ model      │
│ year       │
│ type       │
│ capacity   │
│ status     │
└─────────────┘
      ▲
      │ (1)
      │
   (Many)
      │
      ├─────────────────┐
      │                 │
      │            ┌─────────────┐
      │            │   Driver    │
      │            ├─────────────┤
      │            │ driverID◆   │
      │            │ firstName   │
      │            │ lastName    │
      │            │ license     │
      │            │ class       │
      │            │ telephone   │
      │            │ district    │
      │            └─────────────┘
      │
      └─────────────────┐
                        │
                   ┌─────────────────┐
                   │    Booking      │
                   ├─────────────────┤
                   │ bookingID◆      │
                   │ bookingDate     │
                   │ startDate       │
                   │ endDate         │
                   │ destination     │
                   │ totalFare       │
                   │ paymentStatus   │
                   │ clientID◆◆      │
                   │ vehicleID◆◆     │
                   │ driverID◆◆      │
                   └─────────────────┘
                        ▲
                        │ (Many)
                        │
                        │ (1)
                        │
                   ┌─────────────┐
                   │   Client    │
                   ├─────────────┤
                   │ clientID◆   │
                   │ name        │
                   │ type        │
                   │ telephone   │
                   │ email       │
                   │ district    │
                   └─────────────┘

Vehicle (1) ─── Maintenance (Many)
    │
    ├── maintenanceID◆
    ├── date
    ├── type
    ├── cost
    ├── garage
    └── description
```

Legend:
- ◆ = Primary Key
- ◆◆ = Foreign Key
- 1 = One
- Many = Multiple

## Database Design Principles Applied

1. **Normalization**: Database follows 3NF (Third Normal Form)
2. **Referential Integrity**: Foreign keys maintain data consistency
3. **Atomicity**: Each field contains single, indivisible values
4. **Scalability**: Design supports growth in fleet and bookings
5. **Performance**: Indexes on frequently queried columns
6. **Security**: Cascading deletes where appropriate, restricted deletes for data integrity

## Query Examples

### Get all bookings for a specific vehicle
```sql
SELECT b.* FROM Booking b
WHERE b.vehicleID = ?
ORDER BY b.bookingDate DESC;
```

### Get maintenance history for a vehicle
```sql
SELECT m.* FROM Maintenance m
WHERE m.vehicleID = ?
ORDER BY m.maintenanceDate DESC;
```

### Get total revenue per client
```sql
SELECT c.clientName, SUM(b.totalFare) as totalSpent
FROM Client c
LEFT JOIN Booking b ON c.clientID = b.clientID
GROUP BY c.clientID;
```

### Get vehicle utilization report
```sql
SELECT v.plateNumber, COUNT(b.bookingID) as totalBookings
FROM Vehicle v
LEFT JOIN Booking b ON v.vehicleID = b.vehicleID
GROUP BY v.vehicleID
ORDER BY totalBookings DESC;
```
