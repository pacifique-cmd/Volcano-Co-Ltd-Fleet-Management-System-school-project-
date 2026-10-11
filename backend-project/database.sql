-- Create Database
CREATE DATABASE IF NOT EXISTS VCFMS;
USE VCFMS;
 
-- Vehicle Table
CREATE TABLE Vehicle (
  vehicleID INT AUTO_INCREMENT PRIMARY KEY,
  plateNumber VARCHAR(50) UNIQUE NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  yearOfManufacture INT NOT NULL,
  vehicleType ENUM('Sedan', 'SUV', 'Minibus', 'Cargo Truck') NOT NULL,
  seatingCapacity INT NOT NULL,
  status ENUM('Available', 'In Use', 'Maintenance') DEFAULT 'Available',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver Table
CREATE TABLE Driver (
  driverID INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  licenseNumber VARCHAR(50) UNIQUE NOT NULL,
  licenseClass VARCHAR(10) NOT NULL,
  telephone VARCHAR(15) NOT NULL,
  district VARCHAR(100) NOT NULL,
  vehicleID INT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicleID) REFERENCES Vehicle(vehicleID) ON DELETE SET NULL
);

-- Client Table
CREATE TABLE Client (
  clientID INT AUTO_INCREMENT PRIMARY KEY,
  clientName VARCHAR(150) NOT NULL,
  clientType ENUM('Individual', 'Organization', 'NGO', 'Government', 'Corporate') NOT NULL,
  telephone VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  district VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking Table
CREATE TABLE Booking (
  bookingID INT AUTO_INCREMENT PRIMARY KEY,
  bookingDate DATE NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  destination VARCHAR(200) NOT NULL,
  totalFare DECIMAL(10, 2) NOT NULL,
  paymentStatus ENUM('Pending', 'Paid', 'Cancelled') DEFAULT 'Pending',
  clientID INT NOT NULL,
  vehicleID INT NOT NULL,
  driverID INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE RESTRICT,
  FOREIGN KEY (vehicleID) REFERENCES Vehicle(vehicleID) ON DELETE RESTRICT,
  FOREIGN KEY (driverID) REFERENCES Driver(driverID) ON DELETE RESTRICT
);

-- Maintenance Table
CREATE TABLE Maintenance (
  maintenanceID INT AUTO_INCREMENT PRIMARY KEY,
  maintenanceDate DATE NOT NULL,
  maintenanceType ENUM('Oil Change', 'Tire Replacement', 'General Service', 'Repair', 'Inspection') NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  garage VARCHAR(150) NOT NULL,
  description TEXT,
  vehicleID INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicleID) REFERENCES Vehicle(vehicleID) ON DELETE CASCADE
);

-- User/Staff Table for Login
CREATE TABLE Staff (
  staffID INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role ENUM('Admin', 'Operations', 'Manager') DEFAULT 'Operations',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_vehicleType ON Vehicle(vehicleType);
CREATE INDEX idx_driverStatus ON Driver(status);
CREATE INDEX idx_bookingStatus ON Booking(paymentStatus);
CREATE INDEX idx_bookingDates ON Booking(startDate, endDate);
