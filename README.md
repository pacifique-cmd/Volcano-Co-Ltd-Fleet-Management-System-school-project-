# Volcano Co Ltd Fleet Management System (VCFMS)

A comprehensive web-based fleet management application for Volcano Co Ltd, a licensed transport and vehicle hire company in Rwanda.

## Features

- **Vehicle Management**: Register and manage all vehicles in the fleet
- **Driver Management**: Maintain driver profiles with license information
- **Client Management**: Maintain a centralized client database
- **Booking Management**: Create, update, and manage vehicle bookings with automatic fare calculation
- **Maintenance Tracking**: Record and track vehicle maintenance activities
- **Fleet Reports**: Generate monthly booking reports and fleet performance reports
- **User Authentication**: Secure login system with session management

## Technology Stack

### Backend
- Node.js with Express.js
- MySQL database
- Express Session for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- Tailwind CSS for styling
- Axios for API communication
- React Router for navigation

## Project Structure

```
project-root/
├── backend-project/
│   ├── controllers/        # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication middleware
│   ├── db.js              # Database connection
│   ├── server.js          # Main server file
│   ├── database.sql       # Database schema
│   ├── package.json
│   └── .env              # Environment variables
│
└── frontend-project/
    ├── src/
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── utils/         # API utilities
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    └── .env              # Environment variables
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend-project
```

2. Install dependencies:
```bash
npm install
```

3. Create the database:
- Open MySQL command line or MySQL Workbench
- Run the SQL from `database.sql` file:
```bash
mysql -u root -p < database.sql
```

4. Configure environment variables:
- Edit `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=VCFMS
DB_PORT=3306
SESSION_SECRET=volcano_secret_key_2025
PORT=5000
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend-project
```

2. Install dependencies:
```bash
npm install
```

3. Install additional required packages for Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Setup

The `database.sql` file contains all necessary tables:
- **Vehicle**: Stores vehicle information
- **Driver**: Stores driver profiles
- **Client**: Stores client information
- **Booking**: Manages vehicle bookings
- **Maintenance**: Tracks maintenance records
- **Staff**: User accounts for login

To create a demo user for testing:
```sql
INSERT INTO Staff (username, password, email, role) VALUES 
('admin', '$2a$10$..hashed_password..', 'admin@volcano.com', 'Admin');
```

Demo Credentials (after setup):
- Username: `admin`
- Password: `admin`

## Fare Calculation

The system automatically calculates fares based on vehicle type and booking duration:

| Vehicle Type | Base Fare (RWF/day) | Extra Km Charge (RWF/km) | Insurance Fee (RWF) |
|---|---|---|---|
| Sedan | 25,000 | 50 | 2,000 |
| SUV | 45,000 | 70 | 3,500 |
| Minibus | 60,000 | 80 | 5,000 |
| Cargo Truck | 80,000 | 1,200 | 8,000 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-session` - Check authentication status

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Maintenance
- `GET /api/maintenance` - Get all maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record

### Reports
- `GET /api/reports/monthly?year=2025&month=5` - Monthly booking report
- `GET /api/reports/performance` - Fleet performance report
- `GET /api/reports/date-range?startDate=2025-01-01&endDate=2025-12-31` - Date range report

## Menu Structure

The web application includes the following menu items:
1. **Dashboard** - Overview of fleet statistics
2. **Vehicles** - Vehicle management with insert/delete operations
3. **Drivers** - Driver management with insert/delete operations
4. **Clients** - Client management with insert/delete operations
5. **Bookings** - Full CRUD operations for bookings
6. **Maintenance** - Maintenance tracking with insert/delete operations
7. **Reports** - Monthly and fleet performance reports
8. **Logout** - Secure logout functionality

## Security Features

- Session-based authentication
- Password hashing with bcryptjs
- CSRF protection through session management
- SQL injection prevention with parameterized queries
- Authorized access control for all protected routes

## Troubleshooting

### Backend Connection Issues
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify port 5000 is not in use

### Frontend Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Verify `.env` file has correct API URL

### Database Issues
- Clear all tables and re-run `database.sql`
- Check MySQL user permissions
- Ensure database character set is UTF-8

## Future Enhancements

- SMS notifications for bookings
- Mobile app version
- Advanced analytics dashboard
- Email report generation
- Payment gateway integration
- GPS tracking for vehicles
- Insurance premium calculation

## License

This project is developed for Volcano Co Ltd.

## Support

For issues or questions, please contact the development team.
