# MedSec IDS Docker

MedSec IDS Docker is a system designed to facilitate the deployment of an Intrusion Detection System (IDS) tailored for medical IoT devices. This project leverages Docker containers for seamless deployment, includes pre-built models, and provides a user-friendly interface for interaction.

## Features
- **Streamlit Interface**: Simplified visualization for the IDS outputs.
- **Dockerized Deployment**: Use Docker and Docker Compose for easy installation and execution.
- **Customizable**: Modify the `.env` file for environment-specific configurations.

---

## Installation

### Prerequisites
1. Install [Docker](https://docs.docker.com/get-docker/).
2. Install [Docker Compose](https://docs.docker.com/compose/install/).

### Steps
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd medsec-ids-docker
   ```

2. Set up the environment variables:
   - Open the `.env` file in a text editor and customize the variables as needed:
     ```bash
     nano .env
     ```
     Important variables include:
     - `MEDSEC_URL`: The URL of the MedSecurance backend server. This is required for the system to communicate with the backend.
     - `ADMIN_EMAIL`: A valid email address for the network administrator. This email will receive notifications in case of intrusion detection events.

3. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Open your web browser and navigate to `http://localhost:8501`.

---

## Customization

### Environmental Variables
Customize the following variables in the `.env` file:
- `MEDSEC_URL`: The URL of the MedSecurance backend server.
- `ADMIN_EMAIL`: A valid email address for the network administrator.

### Updating Dependencies
If you need to install additional dependencies:
1. Add them to `requirements.txt`.
2. Rebuild the Docker container:
   ```bash
   docker-compose up --build
   ```

---

## Scripts and Files

- **`Dockerfile`**: Instructions to build the Docker image.
- **`docker-compose.yaml`**: Manages multi-container deployments.
- **`app.py`**: Entry point for the application.
- **`models/`**: Contains pre-trained IDS models.
- **`start.bash`**: A script to start the application manually.
- **`.streamlit/`**: Configuration for Streamlit interface.

---

## Troubleshooting

1. **Docker container fails to start**:
   - Check the logs with:
     ```bash
     docker logs <container_name>
     ```

2. **Cannot access the web application**:
   - Ensure Docker is running and that the correct port is open.

3. **Issues with models and email alerts**:
   - Verify that the backend server is reachable via the `MEDSEC_URL`.

---

## Contributing
Feel free to fork this repository and contribute! Submit a pull request with your changes or enhancements.

---

## License
This project is licensed under the [MIT License](LICENSE).