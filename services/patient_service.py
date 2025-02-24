import os
import pandas as pd
from flask import Blueprint, request, jsonify
from config.sys_paths import BASE_DIR

def extract_batch_data(batch_name):
    """
    Extracts data from all patient files in a batch folder.
    """
    batch_dir = os.path.join(BASE_DIR, batch_name)
    if not os.path.exists(batch_dir):
        return {"error": f"Batch '{batch_name}' not found"}
    
    batch_data = {}
    for root, _, files in os.walk(batch_dir):
        for file in files:
            if file.endswith('.xlsx') or file.endswith('.xls'):
                file_path = os.path.join(root, file)
                batch_data[file] = process_excel_file(file_path)
    
    return {"conditions": batch_data}

def process_excel_file(file_path):
    """
    Processes an Excel file and extracts patient data.
    """
    try:
        excel_data = pd.ExcelFile(file_path)
        patient_data = {"subcategories": []}

        for sheet_name in excel_data.sheet_names:
            sheet_data = excel_data.parse(sheet_name)
            
            if sheet_name.lower() in ["pathogenic variants", "conflicting variants"]:
                patient_data["subcategories"].append({
                    "icon": f"Icons/{sheet_name.replace(' ', '')}Icon.png",
                    "name": sheet_name,
                    "subcategories": [{"name": sheet_name, "subtype": [{"name": sheet_name}]}]
                })
            else:
                if 'Headings' in sheet_data.columns and 'Condition' in sheet_data.columns:
                    subcategories = [
                        {
                            "name": heading,
                            "subtype": [{"name": cond} for cond in group['Condition'].dropna().unique()]
                        }
                        for heading, group in sheet_data.groupby('Headings')
                    ]
                    patient_data["subcategories"].append({
                        "icon": f"Icons/{sheet_name.replace(' ', '')}Icon.png",
                        "name": sheet_name,
                        "subcategories": subcategories
                    })

        return patient_data if patient_data["subcategories"] else {}

    except Exception as e:
        return {"error": str(e)}

# ---------------------- New Functions ----------------------

def extract_batch_data2(batch_name):
    """
    Extracts patient data from all Excel files in a batch folder (alternative method).
    """
    batch_dir = os.path.join(BASE_DIR, batch_name)
    if not os.path.exists(batch_dir):
        return {"error": f"Batch '{batch_name}' not found"}
    
    batch_data = {}
    for root, _, files in os.walk(batch_dir):
        for file in files:
            if file.endswith('.xlsx') or file.endswith('.xls'):
                file_path = os.path.join(root, file)
                batch_data[file] = process_excel_file2(file_path)  # Using the new function
    
    return batch_data  # Directly returning batch_data


def process_excel_file2(file_path):
    """
    Alternative method to process an Excel file and extract patient data.
    """
    try:
        excel_data = pd.ExcelFile(file_path)
        patient_data = {"conditions": []}

        for sheet_name in excel_data.sheet_names:
            df = excel_data.parse(sheet_name)
            df.columns = [' '.join(col.split('_')) for col in df.columns]

            special_condition = "Pathogenic Variants" in sheet_name or "Conflicting Variants" in sheet_name
            
            for _, row in df.iterrows():
                gene_name = row.get("Gene Name", None) if special_condition else row.get("Gene", None)
                gene_name = gene_name if pd.notna(gene_name) else "NaN"

                # Build the JSON object
                json_object = {
                    "Condition": sheet_name if special_condition else (row.get("Condition", None) if pd.notna(row.get("Condition", None)) else "NaN"),
                    "Headings": sheet_name if special_condition else (row.get("Headings", None) if pd.notna(row.get("Headings", None)) else "NaN"),
                    "subtype_cond": sheet_name,
                    "Gene Name": row.get("Gene", None) if pd.notna(row.get("Gene", None)) else "NaN",
                    "Gene": row.get("Gene", None) if pd.notna(row.get("Gene", None)) else "NaN",
                    "Gene Score": row.get("Gene Score", None) if pd.notna(row.get("Gene Score", None)) else "NaN",
                    "rsID": row.get("rsID", None) if pd.notna(row.get("rsID", None)) else "NaN",
                    "Lit": row.get("Literature", None) if pd.notna(row.get("Literature", None)) else "NaN",
                    "CH": row.get("CHROM", None) if pd.notna(row.get("CHROM", None)) else "NaN",
                    "POS": row.get("POS", None) if pd.notna(row.get("POS", None)) else "NaN",
                    "ref": row.get("REF", None) if pd.notna(row.get("REF", None)) else "NaN",
                    "alt": row.get("ALT", None) if pd.notna(row.get("ALT", None)) else "NaN",
                    "Zygosity": row.get("Zygosity", None) if pd.notna(row.get("Zygosity", None)) else "NaN",
                    "Consequence": row.get("Consequence", None) if pd.notna(row.get("Consequence", None)) else "NaN",
                    "Conseq score": row.get("Consequence score", None) if pd.notna(row.get("Consequence score", None)) else "NaN",
                    "IMPACT": row.get("IMPACT", None) if pd.notna(row.get("IMPACT", None)) else "NaN",
                    "IMPACT score": row.get("IMPACT score", None) if pd.notna(row.get("IMPACT score", None)) else "NaN",
                    "ClinVar CLNDN": row.get("ClinVar CLNDN", None) if pd.notna(row.get("ClinVar CLNDN", None)) else "NaN",
                    "Clinical consequence": row.get("Clinical consequence", None) if pd.notna(row.get("Clinical consequence", None)) else "NaN",
                    "clin sig": row.get("ClinVar CLNSIG", None) if pd.notna(row.get("ClinVar CLNSIG", None)) else "NaN",
                    "Variant type": row.get("Variant type", None) if pd.notna(row.get("Variant type", None)) else "NaN"
                }

                patient_data["conditions"].append(json_object)

        return patient_data if patient_data["conditions"] else {}

    except Exception as e:
        return {"error": str(e)}
