# Uptime Monitoring API

The Uptime Monitoring API is designed to enable authenticated users to monitor URLs and retrieve detailed uptime reports, including availability, average response time, and total uptime/downtime.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Server Config

`PORT`: The port number on which the server will listen.

`HOST`: The host address or hostname for the server.

`NODE_ENV`: The environment in which the server is running ( development, production).

### Database Config

`DATABASE_URL`: The URL or connection string for the database.

`DATABASE_USERNAME`: The username for accessing the database.

`DATABASE_PASSWORD`: The password for accessing the database.

### Token Config

`TOKEN_SECRET`: The secret key used to sign authentication tokens.

`TOKEN_EXPIRE_IN`: The expiration duration for authentication tokens.

### Email Config

`EMAIL_HOST`: The hostname or IP address of the email server.

`EMAIL_PORT`: The port number for the email server.

`EMAIL_USERNAME`: The username for the email account.

`EMAIL_PASSWORD`: The password for the email account.

## Setup

Clone the project

```bash
  git clone https://github.com/ahmedelshaar/be-assessment
```

Go to the project directory

```bash
  cd my-project
```

### Running the Project without Docker

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

### Running the Project with Docker

Build the Docker image

```bash
  docker build -t uptime-monitoring-app .
```

Run the Docker container

```bash
  docker run -p 3000:3000 uptime-monitoring-app
```

## Document API in Postman 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/19175846-9b9e3952-a8d1-4b75-b353-add680985ace?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D19175846-9b9e3952-a8d1-4b75-b353-add680985ace%26entityType%3Dcollection%26workspaceId%3Dfad3576a-7f8e-4523-8da3-ee4241e0d192)
