import tabula
import pandas as pd

# Path to your PDF file
pdf_path = "Marksheet.pdf"

# Extract tables from the PDF into a list of DataFrames
dfs = tabula.read_pdf(pdf_path, pages='all')

# Concatenate all tables into a single DataFrame
df = pd.concat(dfs)

# Save the DataFrame to a CSV file
df.to_csv("students.csv", index=False)