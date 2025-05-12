# IoT Inspector

**What is IoT Inspector?** An open-source tool for capturing, analyzing, and visualizing the network activities of your IoT devices. It does not require special hardware or changes to your network. Simply run IoT Inspector and you'll see the results instantly. 

You can use IoT Inspector to 

* learn what companies/countries your IoT devices communicate with
* how much data your devices are sending and receiving
* discover any unknown devices on the network
* maybe more? (Tell us please?)
---

## Installation

__IMPORTANT NOTE__: This tool is only supported on the Linux version of docker due to the need to be hosted on the same network as the network that it needs to scan for devices.

### Prerequisites
1. Install [Docker](https://docs.docker.com/get-docker/).
2. Install [Docker Compose](https://docs.docker.com/compose/install/).

### Steps
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd monitor-matrix
   ```

2. Set up the environment variables:
   - Open the `.env` file in a text editor and customize the variables as needed:
     ```bash
     nano .env
     ```
     Important variables include:
     - `MEDSEC_URL`: The URL of the MedSecurance backend server. This is required for the system to communicate with the backend.
     - `ADMIN_EMAIL`: A valid email address for the network administrator. This email will receive notifications in case of intrusion detection events.
     - `UPDATE_DELAY_MINUTES`: Defines how often the tool will request information for unknown devices on the network from the device manager module. Default is 1 minute.
     - `EMAIL_DELAY_DAYS`: How frequently the tool will send an an unknown device email alert to the `ADMIN_EMAIL` in days. Defalt is 1 day.

3. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Open your web browser and navigate to `http://localhost:33761/inspector_dashboard/`.

Credits - This code is based on the following project:

IoT Inspector is a research project by researchers from New York University. See our [main website](https://inspector.engineering.nyu.edu/) and  [documentation](https://github.com/nyu-mlab/iot-inspector-client/wiki) for more information. Also see [screenshots](https://github.com/nyu-mlab/iot-inspector-client/wiki/Screenshots-(Windows)#running-iot-inspector).

## License
This project is licensed under the [MIT License](LICENSE).