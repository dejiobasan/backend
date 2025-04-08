# FX Trading Backend

This project is the backend service for an FX trading application. It provides APIs for managing user accounts, executing trades, and retrieving live market data.

## Features

- User authentication and authorization using OTP or JWT.
- Trade execution and order management
- Real-time market data retrieval
- Account balance and transaction history

## Technologies Used

- **Backend Framework**: [e.g., NestJS]
- **Database**: [e.g., PostgreSQL ]
- **Authentication**: [e.g., JWT, OTP ]
- **Others**: [e.g., Redis, WebSocket, ExchangeRate-Api]

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/your-username/fx-trading-backend.git
  cd backend
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Set up environment variables:
  Create a `.env` file in the root directory and configure the required variables:
  ```
  DB_HOST= your_database_host
  DB_USERNAME= your_database_user
  DB_PASSWORD= your_database_password
  DB_NAME= your_databe_name "preferably fx-trading"
  JWT_SECRET= your_jwt_secret
  BASE_URL= your local URL // asides production.
  SMTP_USER= your gmail address
  SMTP_PASSWORD= your google app pass word "note: it must be an app password not your google password"
  EXCHANGE_RATE_API_BASE_URL= your exchange rate API url.
  ```

4. Create a database (if you don't have one reated):
  ```bash
  npm run create-db
  ```

5. Start the server:
  ```bash
  npm start:dev
  ```

## API Documentation

Detailed API documentation accessed via the `${BASE_URL}/api` endpoint using SwaggerUI.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Submit a pull request.

## License

This project is licensed under the [Deji] lol.

## Contact

For questions or support, please contact [dejiobasan02@gmail.com].