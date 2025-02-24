import pandas as pd

# Read Excel file
df = pd.read_excel('./Conditions_final_genes.xlsx')

# Convert DataFrame to JSON
json_data = df.to_json(orient='records')

# Save JSON data to a file
with open('condition_raw_convert.json', 'w') as f:
    f.write(json_data)
