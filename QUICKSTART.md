# Quick Start Guide - VCFMS

## Step-by-Step Setup Instructions

### 1. Database Setup

First, create the MySQL database:

```bash
# Login to MySQL
mysql -u root -p

# Run the database script
source backend-project/database.sql

# Or import directly
mysql -u root -p VCFMS < backend-project/database.sql
```

### 2. Create Demo User (Optional)

If you want to create the demo admin user:

```sql
USE VCFMS;

-- Insert demo staff user
-- Password: admin (hashed)
INSERT INTO Staff (username, password, email, role) VALUES 
('admin', '$2a$10$YourHashedPasswordHere', 'admin@volcano.com', 'Admin');
```

### 3. Backend Setup & Start

```bash
# Navigate to backend
cd backend-project

# Install dependencies
npm install

# Update .env file with your MySQL credentials if needed

# Start backend server
npm start
# Server will run on http://localhost:5000
```

### 4. Frontend Setup & Start (in a new terminal)

```bash
# Navigate to frontend
cd frontend-project

# Install dependencies
npm install

# Install Tailwind CSS dependencies
npm install -D tailwindcss postcss autoprefixer

# Start frontend development server
npm start
# Application will open at http://localhost:3000
```

### 5. Login to Application

- Open browser at `http://localhost:3000`
- Login credentials:
  - Username: `admin`
  - Password: `admin`

## Generating Demo Data

You can insert test data into the database:

```sql
USE VCFMS;

-- Insert test vehicles
INSERT INTO Vehicle (plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity, status) 
VALUES 
('RAA001A', 'Toyota', 'Camry', 2022, 'Sedan', 5, 'Available'),
('RAA002A', 'Hyundai', 'Santa Fe', 2021, 'SUV', 7, 'Available'),
('RAA003A', 'Mercedes', 'Sprinter', 2020, 'Minibus', 15, 'Available'),
('RAA004A', 'Hino', 'Truck', 2019, 'Cargo Truck', 3, 'Available');

-- Insert test drivers
INSERT INTO Driver (firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID, status) 
VALUES 
('John', 'Muhire', 'RW12345', 'B', '+250788123456', 'Kigali', 1, 'Active'),
('Jane', 'Nyirandoh', 'RW12346', 'C', '+250788123457', 'Gasabo', 2, 'Active'),
('Peter', 'Mutua', 'RW12347', 'E', '+250788123458', 'Nyarugenge', 3, 'Active');

-- Insert test clients
INSERT INTO Client (clientName, clientType, telephone, email, district) 
VALUES 
('Tech Company Ltd', 'Corporate', '+250788999999', 'contact@techco.rw', 'Kigali'),
('Safari Tours', 'Organization', '+250788888888', 'info@safariours.rw', 'Gasabo'),
('Individual Traveler', 'Individual', '+250789999999', 'traveler@email.com', 'Nyarugenge');

-- Insert test bookings
INSERT INTO Booking (bookingDate, startDate, endDate, destination, clientID, vehicleID, driverID, paymentStatus) 
VALUES 
('2025-05-01', '2025-05-10', '2025-05-15', 'Kigali to Butare', 1, 1, 1, 'Pending'),
('2025-05-02', '2025-05-05', '2025-05-08', 'Kigali to Kibuye', 2, 2, 2, 'Paid');
```

## Common Commands

### Backend Commands
```bash
# Start backend server
npm start

# Start with nodemon (auto-restart on changes)
npm run dev
```

### Frontend Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `VCFMS` exists

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS Not Working
```bash
# Rebuild Tailwind CSS
npm run build:css
```

## Features Overview

### Dashboard
- Overview of fleet statistics
- Quick access to all modules

### Vehicle Management
- Add new vehicles
- View all vehicles in fleet
- Update vehicle information
- Delete vehicles
- Check vehicle availability

### Driver Management
- Register drivers with license details
- Assign drivers to vehicles
- View driver information
- Update driver status
- Remove drivers

### Client Management
- Maintain client database
- Categorize clients (Individual, Organization, NGO, Government, Corporate)
- Store contact information

### Booking Management
- Create new bookings
- Automatic fare calculation based on vehicle type
- Update booking status
- Delete bookings
- Track payment status

### Maintenance Management
- Record maintenance activities
- Track maintenance costs
- Link maintenance to vehicles
- View maintenance history

### Reports
- Monthly booking report with detailed breakdown
- Fleet performance report showing:
  - Vehicle usage and revenue
  - Client spending patterns
  - Driver trip records
- Export-ready data

## System Requirements

- **Node.js**: v14.x or higher
- **MySQL**: v5.7 or higher
- **RAM**: Minimum 2GB
- **Disk Space**: Minimum 500MB
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Support & Documentation

For more information, refer to the main README.md file in the project root.
