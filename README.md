# Node Stater with Express and TypeScript

This is a boilerplate starter for building a scalable REST API using **Node.js**, **Express**, and **TypeScript**. It includes tools and configurations for development such as **Winston** and **Morgan** for logging, **ESLint** for code linting, **Zod** for schema validation, and **Docker** support. The template ensures consistency with standardized configurations like `.env` formatting and TypeScript setup.

## ✨ Features

- **Express** for building RESTful APIs
- **TypeScript** for type safety and scalability
- **Winston** and **Morgan** for efficient logging
- **ESLint** with TypeScript and security plugins for code quality
- **Zod** for runtime schema validation
- **Docker** support for containerized deployment
- **@stoplight/elements** for interactive API documentation
- Pre-configured `tsconfig.json` and ESLint rules
- OpenAPI-based API documentation with YAML schemas

## 🚀 Prerequisites

- **Node.js**: v22.x or higher
- **npm**: v10.x or higher
- **Docker**: (optional) for containerized deployment
- **Git**: For cloning the repository

## 🔧 Local Development

1. **Navigate to the directory**:

```bash
cd ./node-express-ts-stater
```

2. **Install dependencies**

```bash
npm install
```

## 🔑 Environment Variables

To configure the application, you need to create a `.env.development` file in the project root. Below are two methods to set it up:

### Option 1: Copy from `.env.example`

1. **Create a `.env.development` file** in the project root:

   ```bash
   cp .env.example .env.development
   ```

### Option 2: Use the Setup Script

2. **Run the setup script** to automatically generate `.env.development` and `.env.production` from `.env.example`

   ```bash
   npm run setup-env
   ```

### Configuring Environment Variables

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

Run the project in development mode with hot-reloading:

```bash
npm run dev
```

The server will be available at [http://localhost:3000](http://localhost:3000).

## 🐳 Running with Docker

### Docker Compose

This is the easiest way to get started. It handles the build process and port mapping automatically.

1. **Start the application:**

```bash
docker-compose up -d --build
```

2. **Stop the application:**

```bash
docker-compose down
```

### Docker CLI

1. **Build the Docker image**

```bash
docker build -t node-starter-img .
```

2. **Run the container**

```bash
docker run -d -p 3000:3000 --name node-starter-app node-starter-img
```

3. **Stop and remove the container**

```bash
docker stop node-starter-app
docker rm node-starter-app
```

## 📖 API Documentation

This project uses @stoplight/elements to serve interactive API documentation based on OpenAPI (Swagger) specifications. The documentation is available at the /docs endpoint.

1. **Access API Documentation:** After starting the server, visit:

```
http://localhost:3000/docs
```

2. **API Specification:** The OpenAPI specification is defined in the docs/ directory, with the main file being docs/openapi.yaml. Supporting schemas and responses are located in docs/components/ and docs/paths/.

3. **Updating Documentation:** Modify the YAML files in the docs/ directory to update the API documentation. The @stoplight/elements library renders these files into an interactive UI.

## 🛡️ Linting and Code Quality

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

## 📂 Project Structure Overview

```
node-express-ts-starter/
├── docs/
├── scripts/
├── src/
│   ├── config/
│   ├── const/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   └── main.ts
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

#### Key Directories

- src/: Core application logic, separated by responsibility.

- docs/: API documentation and technical specifications.

- scripts/: Automation scripts for environment setup (e.g., generating .env.dev and .env.prod from templates).

## 📜 Scripts

- `npm start`: Run the compiled JavaScript in production
- `npm run dev`: Run in development mode with hot-reloading
- `npm run build`: Compile TypeScript to JavaScript
- `npm run setup-env`: Setup script environment,
- `npm run format`: Automatically fix format prettier,
- `npm run lint`: Check code for linting issues
- `npm run lint:fix`: Automatically fix linting issues

## 📦 Updating Dependencies

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

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
