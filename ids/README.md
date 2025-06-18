# MedSec IDS Docker

MedSec IDS Docker is a system designed to facilitate the deployment of an Intrusion Detection System (IDS) tailored for medical IoT devices. This project leverages Docker containers for seamless deployment, includes pre-built models, and provides a user-friendly interface for interaction.

## Features
- **Streamlit Interface**: Simplified visualization for the IDS outputs.
- **Dockerized Deployment**: Use Docker and Docker Compose for easy installation and execution.
- **Customizable**: Modify the `.env` file for environment-specific configurations.

---

## Scripts and Files

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