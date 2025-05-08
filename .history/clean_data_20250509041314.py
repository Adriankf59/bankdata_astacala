import pandas as pd

# Read the CSV file
df = pd.read_csv('your_file.csv')

# Clean the coordinates column
df['Titik Koordinat'] = df['Titik Koordinat'].str.replace('Â', '')

# Extract only the needed columns
columns_to_keep = [
    'No.', 'Nama Gua', 'Sinonim', 'Desa', 'Area', 'Titik Koordinat', 
    'Elevasi Mulut Gua (mdpl)', 'Karakter Lorong', 'Total Kedalaman Lorong (meter)', 
    'Total Panjang Lorong (meter)', 'Status Explore', 'Karakter Lorong'
]

# Keep only the selected columns
df_cleaned = df[columns_to_keep]

# Save to a new CSV file
df_cleaned.to_csv('cleaned_cave_data.csv', index=False)