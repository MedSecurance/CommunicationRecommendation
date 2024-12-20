# MedSecurance 🚀

This repository contains a comprehensive application designed for evaluating protocols, 
assessing risks, and managing and monitoring devices in real time.

## Key Features
- Protocol Evaluation\
  Analyze communication protocols to ensure compliance with industry standards and identify potential vulnerabilities.
  - Automated protocol analysis.
  - Detailed reporting on compliance and risks.
  
- Risk Assessment
  - Perform in-depth risk assessments for devices and network components.
  - Comprehensive risk scoring system.
  - Actionable insights for risk mitigation.
  
- Device Management
  - Seamlessly monitor and manage connected devices in your network.
  - Centralized device inventory.
  - Automated issue detection and alerts.
  
- Real-Time Monitoring
  - Stay updated with real-time data on device and network performance.
  - Live dashboards.
  - Event logging and detailed analytics.
  - Notifications for critical events or anomalies.

## Installation

__IMPORTANT NOTE__: This tool is only supported on the Linux version of docker due to the need to be hosted on the same network as the network that it needs to scan for devices.

### Prerequisites
1. Install [Docker](https://docs.docker.com/get-docker/).
2. Install [Docker Compose](https://docs.docker.com/compose/install/).

### Steps
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd euc-medsec
   ```

2. Set up the environment variables:
   - Open the `.env` file in a text editor and customize the variables as needed:
     ```bash
     nano .env
     ```
     Important variables include:
     - `POSTGRES_USER`: The database user that will be created during the database first startup.
     - `POSTGRES_PASSWORD`: The password of the database user that will be created during the database first startup.
     - `DB_CONNECTION_STRING`: The connection string of the database.
     - `PLATFORM_ADMIN_EMAIL`: The email of the user that will be created as admin during the platform's first startup.
     - `PLATFORM_ADMIN_PASSWORD`: The password of the admin that will be created as admin during the platform's first startup.
     - `EMAIL_HOST`: The host of your mail server (i.e. `smtp.gmail.com`).
     - `EMAIL_HOST_PORT`: The port of the host of your mail server.
     - `EMAIL_SENDER_EMAIL`: The sender email (i.e. no-reply@something.com).
     - `EMAIL_SENDER_PASSWORD`: The password of the sender email.
     - `EMAIL_SENDER_NAME`: The name of the sender to be shown on emails. Default is `Med Securance`
     - `REACT_APP_API_BASE_URL`: The URL of the MedSecurance backend server. This is required for the `frontend` application to communicate with the backend.
     - `MEDSEC_URL`: The URL of the MedSecurance backend server. This is required for the system to communicate with the backend.
     - `ADMIN_EMAIL`: A valid email address for the network administrator
     - `UPDATE_DELAY_MINUTES`: Defines how often the tool will request information for unknown devices on the network from the device manager module. Default is 1 minute.
     - `EMAIL_DELAY_DAYS`: How frequently the tool will send an unknown device email alert to the `ADMIN_EMAIL` in days. Default is 1 day.

3. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
  - Open your web browser and navigate to `http://localhost`.

Credits - The code of `monitor-matrix` is based on the following project:

IoT Inspector is a research project by researchers from New York University. See our [main website](https://inspector.engineering.nyu.edu/) and  [documentation](https://github.com/nyu-mlab/iot-inspector-client/wiki) for more information. Also see [screenshots](https://github.com/nyu-mlab/iot-inspector-client/wiki/Screenshots-(Windows)#running-iot-inspector).

## License
This project is licensed under the [MIT License](LICENSE).
