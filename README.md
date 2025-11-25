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
     - `EMAIL_HOST`: The host of your mail server (i.e. `smtp.gmail.com`).
     - `EMAIL_HOST_PORT`: The port of the host of your mail server.
     - `EMAIL_SENDER_EMAIL`: The sender email (i.e. no-reply@something.com).
     - `EMAIL_SENDER_PASSWORD`: The password of the sender email.
     - `EMAIL_SENDER_NAME`: The name of the sender to be shown on emails. Default is `Med Securance`
     - `REACT_APP_API_BASE_URL`: The URL of the MedSecurance backend server. This is required for the `frontend` application to communicate with the backend.
     - `ADMIN_EMAIL`: A valid email address for the network administrator. A valid email address for the network administrator. This email will receive notifications in case of intrusion detection events or unknown device detection.
     - `UPDATE_DELAY_MINUTES`: Defines how often the tool will request information for unknown devices on the network from the device manager module. Default is 1 minute.
     - `EMAIL_DELAY_DAYS`: How frequently the tool will send an unknown device email alert to the `ADMIN_EMAIL` in days. Default is 1 day.
     - `KEYCLOAK_BACKEND_URL`: The URL of the Keycloak server. This is required for the `backend` application to communicate with the Keycloak server.
     - `REACT_APP_KEYCLOAK_URL`: The URL of the Keycloak server. This is required for the `frontend` application to communicate with the Keycloak server.
     - `EVIDENCE_MANAGER_API_URL`: The URL of the Evidence Manager API server. This is required for the `backend` application to communicate with the Evidence Manager API server.

3. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. To access the different services use your web browser and navigate to the following URLs:
  - `http://localhost` to access the Risk Assessment, Device Manager, System configuration options and log files (Based on the user role different options maybe visible)
    - Default username: user@example.com
    - Default password: password123
  - `http://localhost:8081` to access the keycloak instance. 
    - Default username: admin
    - Default password: admin
  - `http://localhost:33761/inspector_dashboard` to access the Monitor-Matrix tool
  - `http://localhost:8501` to access the Intrusion Detection System (IDS)

>[!Note]
>To deploy individual components you can comment out individual services inside the `docker-compose.yaml` file as follow:
>1. To deploy the core components you need to keep the following services:
>   - postgress
>   - backend
>   - frontend
>   - keycloak
>2. To deploy the Monitor-Matrix service you only need to keep the Monitor-Matrix service section in your docker-deployment.yaml file. The assumption here is that the core components are already installed in a >different machine. In this case you can access the service using the following URL: `http://<server-ip-address|domain-name>:33761/inspector_dashboard` 

>[!IMPORTANT] 
>For the deployment option 2 above see inline comments to properly configure Monitor-Matrix to properly communicate with the backend services.   


Credits - The code of `monitor-matrix` is based on the following project:

IoT Inspector is a research project by researchers from New York University. See our [main website](https://inspector.engineering.nyu.edu/) and  [documentation](https://github.com/nyu-mlab/iot-inspector-client/wiki) for more information. Also see [screenshots](https://github.com/nyu-mlab/iot-inspector-client/wiki/Screenshots-(Windows)#running-iot-inspector).

## License
This project is licensed under the [MIT License](LICENSE).
