from flask import Flask, request, send_file
from flask_cors import CORS
from routes.batch_routes import batch_routes
from routes.patient_routes import patient_bp
from routes.json_process_routes import json_process_bp
import pandas as pd
import os

app = Flask(__name__)

CORS(app)

# Register the batch routes
app.register_blueprint(batch_routes)
app.register_blueprint(patient_bp)
app.register_blueprint(json_process_bp)  

# Set the path to one level up from "Backend"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # Moves one step up
REPORTS_DIR = os.path.join(BASE_DIR, "Regular&ScoringCharts", "ScoringCharts")  

# Ensure directory exists
os.makedirs(REPORTS_DIR, exist_ok=True)

@app.route("/excel-download", methods=["POST"])
def generate_excel():
    try:
        # Get JSON data from frontend
        json_data = request.get_json()
        headers = json_data.get("headers", [])
        data = json_data.get("data", [])
        selected_patient = json_data.get("selectedPatient", "").strip()  # Ensure it's a string
        selected_batch = json_data.get("selectedBatch", "BATCH1").strip()  # Default batch = "BATCH1" if not provided

        if not headers or not data:
            return {"error": "Invalid data received"}, 400

        # Convert JSON data to a DataFrame
        df = pd.DataFrame(data, columns=[
            "condition", "low", "lowToMild", "mild", "mildToModerate", "moderate", "moderateToHigh", "high",
            "concern", "noMutation", "aiScore", "reason"
        ])

        # Rename columns to match headers
        df.columns = headers

        # Create batch-specific folder inside "ScoringCharts"
        batch_folder = os.path.join(REPORTS_DIR, selected_batch)
        os.makedirs(batch_folder, exist_ok=True)  # Ensure batch folder exists

        # Define file path inside batch folder
        file_path = os.path.join(batch_folder, f"{selected_patient}_Scoring_chart.xlsx")

        # Save to Excel
        df.to_excel(file_path, index=False)

        # Return file for download
        return send_file(
            file_path,
            as_attachment=True,
            download_name=f"{selected_patient}_ScoringChart.xlsx",  # Use selectedPatient for filename
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except Exception as e:
        return {"error": f"Failed to generate Excel: {str(e)}"}, 500



if __name__ == '__main__':
    app.run(debug=True)