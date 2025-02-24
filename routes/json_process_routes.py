import os
import json
from flask import Blueprint, jsonify, request
from config.sys_paths import BASE_DIR

json_process_bp = Blueprint('json_process', __name__)

BASE_PATH = BASE_DIR

def load_json(batch_id, patient_id, file_type):
    file_name = f"{patient_id}_{file_type}.json"
    file_path = os.path.join(BASE_PATH, batch_id, patient_id, file_name)
    
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

@json_process_bp.route('/json/<batch_id>/<patient_id>/<file_type>', methods=['GET'])
def get_json_data(batch_id, patient_id, file_type):
    data = load_json(batch_id, patient_id, file_type)
    return jsonify(data)
