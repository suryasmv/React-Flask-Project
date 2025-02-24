import os
from config.sys_paths import BASE_DIR

def get_batches_with_files():
    batches = {}

    # Iterate through batch folders (BATCH1, BATCH2, etc.)
    for batch in os.listdir(BASE_DIR):
        batch_path = os.path.join(BASE_DIR, batch)

        if os.path.isdir(batch_path):  # Ensure it's a directory
            patient_files = []

            # Iterate through patient folders inside each batch
            for patient in os.listdir(batch_path):
                patient_path = os.path.join(batch_path, patient)

                if os.path.isdir(patient_path):  # Ensure it's a directory
                    # Find the patient's Excel file
                    for file in os.listdir(patient_path):
                        if file.endswith(".xlsx"):  # Filter only Excel files
                            filename_without_extension = os.path.splitext(file)[0]  # Remove .xlsx extension
                            patient_files.append(filename_without_extension)  

            # Store batch-wise patient file names (Normalize batch name)
            batch_key = batch.upper()  # Convert batch names to uppercase
            if patient_files:  # Only add non-empty batches
                batches[batch_key] = patient_files

    return batches
