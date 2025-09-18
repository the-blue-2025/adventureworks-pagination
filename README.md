# AdventureWorks Products

A modern single-page web application built with Angular, Node.js, TypeScript, Express, and MS SQL Server. This application allows users to search and filter products from the AdventureWorks2019 database using a clean, responsive interface.

## Features

- **Product Search**: Search products by name, product number, color, product line, class, style, and size
- **Server-side Pagination**: Navigate through products with configurable page sizes (25, 50, 100 items per page)
- **Server-side Sorting**: Click any column header to sort products (ascending, descending, or unsorted)
- **State Persistence**: Sort order and search criteria are maintained when navigating between pages
- **Responsive Design**: Built with ng-bootstrap for a modern, mobile-friendly interface
- **Angular Signals**: Modern reactive state management with signals and computed values
- **Reactive Forms**: Type-safe form handling with FormBuilder and FormGroup
- **Domain Driven Design**: Clean architecture with separation of concerns
- **TypeScript**: Full type safety across frontend and backend
- **Real-time Search**: Instant search results with loading states and error handling

## Tech Stack

### Frontend
- Angular 16
- TypeScript
- Angular Signals
- Reactive Forms
- ng-bootstrap
- Bootstrap 5
- RxJS

### Backend
- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- MS SQL Server

### Database
- Microsoft SQL Server
- AdventureWorks2019 database

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Microsoft SQL Server
- AdventureWorks2019 database

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adventureworks-pagination
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure the database**
   - Copy `backend/env.example` to `backend/.env`
   - Update the database connection details in `backend/.env`:
     ```
     DB_HOST=localhost
     DB_PORT=1433
     DB_NAME=AdventureWorks2019
     DB_USER=your_username
     DB_PASSWORD=your_password
     PORT=3000
     ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 3000) and the Angular development server (port 4200).

## Project Structure

```
adventureworks-pagination/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── application/     # Application services
│   │   ├── domain/          # Domain entities and repositories
│   │   ├── infrastructure/  # Data access layer
│   │   ├── presentation/    # Controllers and routes
│   │   └── config/          # Database configuration
│   └── package.json
├── frontend/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   └── services/    # Angular services
│   │   └── styles.scss
│   └── package.json
└── package.json            # Root package.json for scripts
```

## API Endpoints

- `GET /api/products` - Get all products with optional search criteria, pagination, and sorting
  - Query parameters: `page`, `limit`, `sortBy`, `sortDir`, `name`, `productNumber`, `color`, `productLine`, `class`, `style`, `size`
- `GET /api/products/search` - Search products with specific criteria, pagination, and sorting
  - Query parameters: `page`, `limit`, `sortBy`, `sortDir`, `name`, `productNumber`, `color`, `productLine`, `class`, `style`, `size`
- `GET /api/products/:id` - Get a specific product by ID
- `GET /health` - Health check endpoint

## Usage

1. Open your browser and navigate to `http://localhost:4200`
2. Use the search form to filter products by various criteria
3. Click "Search" to apply filters or "Clear" to reset
4. Click any column header to sort products (ascending → descending → unsorted)
5. Use the page size selector to choose 25, 50, or 100 items per page
6. Navigate between pages using the pagination controls at the bottom
7. Sort order and search criteria are automatically preserved when changing pages

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Building for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## Architecture

This application follows Domain Driven Design (DDD) principles with modern Angular patterns:

### Backend Architecture
- **Domain Layer**: Contains entities and repository interfaces
- **Application Layer**: Contains business logic and services
- **Infrastructure Layer**: Contains data access implementations
- **Presentation Layer**: Contains controllers and API routes

### Frontend Architecture
- **Angular Signals**: Reactive state management with signals and computed values
- **Reactive Forms**: Type-safe form handling with FormBuilder
- **Component-based**: Modular components with clear separation of concerns
- **Service Layer**: HTTP services for API communication
- **Server-side Pagination**: Efficient data loading with ng-bootstrap pagination controls
- **Server-side Sorting**: Column sorting with state persistence across page navigation
- **Modern Angular**: Uses latest Angular 16 features including control flow syntax

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.