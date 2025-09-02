import sys
import json
import os
import requests

API_BASE_URL = 'http://localhost:8000/'
CATEGORY = 'risk-assessment'
SECTIONS = ['Mitigations', 'SafeConfigs', 'Replacements']
EVIDENCE_DIR = 'REPOSITORY/EVIDENCE/'
RESULT_FILE = f"{EVIDENCE_DIR}result_latest.txt"

def download_json(filename):
    url = f"{API_BASE_URL}/download/{CATEGORY}/{filename}?as_json=true"
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError(f"Download failed with status code {response.status_code}: {response.text}")

    try:
        json_data = response.json()
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse JSON: {e}")

    return json_data

def check_weight(entry, threshold):
    return int(entry["Weight"]) > threshold

def process_sections(sections, data, threshold):
    issues_found = {}
    issues_count = 0
    for section in sections:
        if section == 'Replacements':
            for entry in data[section]['Suggestions']:
                if check_weight(entry, threshold):
                    issues_found.setdefault(section, []).append(entry)
                    issues_count += 1
        else:
            for entry in data[section]:
                if check_weight(entry, threshold):
                    issues_found.setdefault(section, []).append(entry)
                    issues_count += 1
    return issues_found, issues_count

if __name__ == "__main__":
    if len(sys.argv) < 4:
        with open(RESULT_FILE, 'w') as f:
            f.write("Wrong Arguments")
        sys.exit(1)

    network_name = sys.argv[1]
    protocol = sys.argv[2]
    threshold = int(sys.argv[3])

    filename = f"{protocol}_{network_name}.json".lower().replace(" ", "_")

    data = download_json(filename)
    data = data["json_data"]
    issues_found, issues_count = process_sections(SECTIONS, data, threshold)

    if not os.path.exists(EVIDENCE_DIR):
        os.makedirs(EVIDENCE_DIR)

    output_file_path = os.path.join(EVIDENCE_DIR, 'issues_found.json')

    if issues_count > 0:
        with open(output_file_path, 'w') as f:
            json.dump(issues_found, f, indent=2)

        with open(RESULT_FILE, 'w') as f:
            f.write("false")
    else:
        if os.path.exists(output_file_path):
            os.remove(output_file_path)
        with open(RESULT_FILE, 'w') as f:
            f.write("true")

    sys.exit(0)
