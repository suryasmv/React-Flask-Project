from flask import Blueprint, request, jsonify
from services.patient_service import extract_batch_data, extract_batch_data2  # Correct Import
import os
from flask import Blueprint, send_file, abort
from config.sys_paths import BASE_DIR

patient_bp = Blueprint('patient_routes', __name__)

@patient_bp.route('/get-batch-data', methods=['GET'])
def get_batch_data():
    """
    API endpoint to fetch all patient data from a batch folder.
    """
    batch_name = request.args.get('batch_name')

    if not batch_name:
        return jsonify({"error": "Missing batch_name"}), 400

    data = extract_batch_data(batch_name)
    return jsonify(data)

@patient_bp.route('/get-batch-data2', methods=['GET'])
def get_batch_data2():
    """
    API endpoint to fetch all patient data from a batch folder.
    """
    batch_name = request.args.get('batch_name')

    if not batch_name:
        return jsonify({"error": "Missing batch_name"}), 400

    data = extract_batch_data2(batch_name)
    return jsonify(data), 200

@patient_bp.route('/patient_files/<batch_name>/<patient_id>/<file_type>', methods=['GET'])
def serve_patient_file(batch_name, patient_id, file_type):
    """
    Serve patient-specific PDF files based on batch, patient ID, and file type.
    
    Example file structure:
    D:\Backend\patient_files\BATCH1\KHAIGHGPTTL569\KHAIGHGPTTL569.pdf
    """

    # Mapping file types to filenames
    file_map = {
        "pdf": f"{patient_id}.pdf",
        "consent": f"{patient_id}_consent.pdf",
        "blood_reports": f"{patient_id}_Blood_Reports.pdf"
    }

    # Ensure the file type is valid
    if file_type not in file_map:
        abort(400, description="Invalid file type")

    # Construct the full path to the file
    file_path = os.path.join(BASE_DIR, batch_name, patient_id, file_map[file_type])

    # Check if the file exists
    if os.path.exists(file_path):
        return send_file(file_path, mimetype="application/pdf")
    else:
        abort(404, description="File not found")