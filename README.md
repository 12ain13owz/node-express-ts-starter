# Node.js Template with Express and TypeScript

This is a boilerplate template for building a scalable REST API using **Node.js**, **Express**, and **TypeScript**. It includes tools and configurations for development, testing, and production, such as **Winston** and **Morgan** for logging, **ESLint** for code linting, **Zod** for schema validation, and **Docker** support. The template ensures consistency with standardized configurations like `.env` formatting and TypeScript setup.

## Features

- **Express** for building RESTful APIs
- **TypeScript** for type safety and scalability
- **Winston** and **Morgan** for efficient logging
- **ESLint** with TypeScript and security plugins for code quality
- **Zod** for runtime schema validation
- **Dotenv** for environment variable management
- **Docker** support for containerized deployment
- **@stoplight/elements** for interactive API documentation
- Pre-configured `tsconfig.json` and ESLint rules
- OpenAPI-based API documentation with YAML schemas

## Prerequisites

- **Node.js**: v22.x or higher
- **npm**: v10.x or higher
- **Docker**: (optional) for containerized deployment
- **Git**: For cloning the repository

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd node-express-ts-starter
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   This installs both production and development dependencies listed below.

3. **Production dependencies**:

   ```bash
   npm i @stoplight/elements config cors dayjs dotenv express express-rate-limit helmet morgan winston zod
   ```

4. **Development dependencies**:

   ```bash
   npm i -D @eslint/js @types/config @types/express @types/cors @types/morgan @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser chalk cross-env eslint eslint-plugin-import eslint-plugin-security globals prettier rimraf ts-node tsc-alias tsx typescript typescript-eslint
   ```

## Environment Variables

To configure the application, you need to create a `.env.development` file in the project root. Below are two methods to set it up:

#### Option 1: Copy from `.env.example`

1. **Create a `.env.development` file** in the project root:

   ```bash
   cp .env.example .env.development
   ```

#### Option 2: Use the Setup Script

2. **Run the setup script** to automatically generate `.env.development` and `.env.production` from `.env.example`

   ```bash
   npm run setup-env
   ```

#### Configuring Environment Variables

**Edit `.env.development`** with your configuration. All values **must** be enclosed in double quotes (`"`) for consistency:

```env
PORT="3000"
NODE_ENV="development"
BASE_URL="http://localhost:"
LOG_LEVEL_CONSOLE="debug"
LOG_LEVEL_FILE="info"
LOG_LEVEL_ERROR_FILE="error"
```

**Note**: Ensure `.env.development` is listed in `.gitignore` to keep it out of version control.

## Running the Project

#### Development

Run the project in development mode with hot-reloading:

```bash
npm run dev
```

This uses `tsx` to watch and run TypeScript files directly.

#### Docker

1. Build the Docker image:

   ```bash
   docker build -t node-express-ts-starter .
   ```

2. Run the container:

   ```bash
   docker run -d -p 3000:3000 --name nodejs-dev node-express-ts-starter
   ```

The server will be available at `http://localhost:3000` (or the port specified in `.env.development`).

#### Stopping the Container

```bash
docker stop nodejs-dev
docker rm nodejs-dev
```

## API Documentation

This project uses @stoplight/elements to serve interactive API documentation based on OpenAPI (Swagger) specifications. The documentation is available at the /docs endpoint.

1. **Access API Documentation:** After starting the server, visit:

```
http://localhost:3000/docs
```

2. **API Specification:** The OpenAPI specification is defined in the docs/ directory, with the main file being docs/openapi.yaml. Supporting schemas and responses are located in docs/components/ and docs/paths/.

3. **Updating Documentation:** Modify the YAML files in the docs/ directory to update the API documentation. The @stoplight/elements library renders these files into an interactive UI.

## Linting and Code Quality

This project uses **ESLint** with TypeScript and security-focused plugins to ensure code quality and consistency.

1. **Run linting** to check for issues:

   ```bash
   npm run lint
   ```

2. **Fix linting issues** automatically (where possible):

   ```bash
   npm run lint:fix
   ```

The ESLint configuration (`eslint.config.mjs`) includes:

- TypeScript-specific rules (`@typescript-eslint`)
- Security best practices (`eslint-plugin-security`, `eslint-plugin-no-unsanitized`)
- Import sorting (`eslint-plugin-import`)

## Project Structure

```
node-express-ts-starter/
├── docs/                                 # API documentation files
├── src/                                  # Source code (TypeScript)
│   ├── config/                           # Configuration files
│   ├── const/                            # Constant definitions
│   ├── controllers/                      # Request handlers for routes
│   ├── middlewares/                      # Express middleware
│   ├── routes/                           # API routes
│   ├── types/                            # TypeScript type definitions
│   ├── utils/                            # Utility functions
│   └── main.ts                           # Main entry point
├── dist/                                 # Compiled JavaScript (after build) (not committed)
├── .env.development                      # Environment development variables (not committed)
├── .env.example                          # Template for .env.development or .env.production
├── .gitattributes                        # Git attributes configuration
├── .gitignore                            # Files to ignore in Git
├── .prettierrc                           # Prettier configuration
├── Dockerfile                            # Docker configuration
├── eslint.config.mjs                     # ESLint configuration
├── package.json                          # Dependencies and scripts
├── package-lock.json                     # Dependency lock file
├── README.md                             # Project documentation
└── tsconfig.json                         # TypeScript configuration
```

## Scripts

- `npm start`: Run the compiled JavaScript in production
- `npm run dev`: Run in development mode with hot-reloading
- `npm run build`: Compile TypeScript to JavaScript
- `npm run setup-env`: Setup script environment,
- `npm run format`: Automatically fix format prettier,
- `npm run lint`: Check code for linting issues
- `npm run lint:fix`: Automatically fix linting issues
- `npm test`: (Optional) Add your test script here

## Updating Dependencies

To keep dependencies up-to-date:

1. Check for outdated packages:

   ```bash
   npm outdated
   ```

2. Update dependencies to the latest versions:

   ```bash
   npx npm-check-updates -u
   npm install --force
   ```

## Testing

Tests are not yet implemented. To add tests, consider using a framework like **Jest** or **Mocha**. Update the `npm test` script in `package.json` accordingly.

## License

This project is licensed under the ISC License. See the `package.json` for details.
