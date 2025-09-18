# Database Setup Guide

## Quick Setup

The application is configured to work with default SQL Server settings. If you need to customize the database connection, create a `.env` file in the `backend` folder:

```bash
# Copy the example file
copy backend\env.example backend\.env
```

Then edit `backend\.env` with your SQL Server details:

```
DB_HOST=localhost
DB_PORT=1433
DB_NAME=AdventureWorks2019
DB_USER=sa
DB_PASSWORD=YourPassword123
PORT=3000
```

## Default Configuration

If no `.env` file is found, the application will use these defaults:
- **Host**: localhost
- **Port**: 1433
- **Database**: AdventureWorks2019
- **Username**: sa
- **Password**: YourPassword123

## Prerequisites

1. **SQL Server**: Make sure SQL Server is running
2. **AdventureWorks2019**: Download and install the AdventureWorks2019 database
3. **Authentication**: Ensure your SQL Server allows SQL Server authentication

## Download AdventureWorks2019

1. Go to [Microsoft AdventureWorks Sample Databases](https://github.com/Microsoft/sql-server-samples/releases/tag/adventureworks)
2. Download `AdventureWorks2019.bak`
3. Restore the database in SQL Server Management Studio

## Troubleshooting

### Connection Issues
- Verify SQL Server is running
- Check if TCP/IP is enabled in SQL Server Configuration Manager
- Ensure the AdventureWorks2019 database exists
- Verify your username and password

### Authentication Issues
- Make sure SQL Server authentication is enabled
- Check if the user has access to the AdventureWorks2019 database
- Verify the user has appropriate permissions

## Testing the Connection

Once the application is running, you can test the database connection by visiting:
- http://localhost:3000/health
- http://localhost:3000/api/products
