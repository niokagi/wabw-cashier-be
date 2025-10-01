# Hapi.js & PostgreSQL Boilerplate

A backend boilerplate for Node.js, Hapi.js, and PostgreSQL, runnable with Docker or a local development environment.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ (for NPM scripts)
- [PostgreSQL](https://www.postgresql.org/) (latest recommended)  
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (latest recommended)  

## Installation


Clone this repo and set up your `.env` file. 
```bash
git clone https://github.com/niokagi/hapi-pgsql-boilerplate.git

cd hapi-pgsql-boilerplate

cp .env.example .env
```

## Run with a Local PostgreSQL Instance
This workflow is an alternative to Docker if you prefer to run Node.js and PostgreSQL directly on your host machine.

### 1. Create and Migrate the Database
**Create the Database Manually**
Before running migrations, you must create the database on your PostgreSQL server. Connect using `psql` or a GUI client (like DBeaver/pgAdmin) and run:
```sql
CREATE DATABASE "hapi-starter";
```
*Note: Ensure the name matches the `PGDATABASE` value in your `.env` file.*

### 2. Run Migrations
```bash
npm run migrate up
```
Migration commands:

| Command                  | Description                                |
| :----------------------- | :----------------------------------------- |
| `npm run migrate create <name>` | Create a new migration file.             |
| `npm run migrate up`     | Apply all pending migrations.              |
| `npm run migrate down`   | Revert the last applied migration.         |

### 3. Run the Development Server
```bash
npm run dev
```
The server will be running on `http://localhost:3000` by default.

## Dev Workflow with Docker

| Command                                           | Description                                  |
| ------------------------------------------------- | -------------------------------------------- |
| `docker-compose up --build -d`                   | Build and start all services.                |
| `docker-compose down`                            | Stop and remove project containers.          |
| `docker-compose logs -f app`                     | Stream application logs.                     |
| `npm run migrate create <name>`                  | Create a new migration file.                 |
| `docker-compose exec app npm run migrate up`     | Run all pending migrations.                  |
| `docker-compose exec db psql -U <user> -d <db>`  | Open PostgreSQL shell inside container.      |

*Note: Use `localhost` with `.env` credentials for GUI clients (e.g., DBeaver, TablePlus).*
