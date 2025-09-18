# Quick Setup Guide

## 1. Database Configuration

1. Copy the environment file:
   ```bash
   copy backend\env.example backend\.env
   ```

2. Edit `backend\.env` with your SQL Server details:
   ```
   DB_HOST=localhost
   DB_PORT=1433
   DB_NAME=AdventureWorks2019
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=3000
   ```

## 2. Start the Application

Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or start them separately:

**Backend (Terminal 1):**
```bash
npm run server
```

**Frontend (Terminal 2):**
```bash
npm run client
```

## 3. Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 4. Troubleshooting

If you encounter database connection issues:
1. Ensure SQL Server is running
2. Verify AdventureWorks2019 database exists
3. Check your connection credentials in `.env`
4. Make sure SQL Server allows TCP/IP connections

## 5. Features

- ✅ Search products by name, number, color, line, class, style, size
- ✅ Pagination for large datasets
- ✅ Responsive design with ng-bootstrap
- ✅ Real-time search with loading states
- ✅ Clean, modern interface
