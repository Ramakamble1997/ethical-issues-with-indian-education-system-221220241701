import matplotlib.pyplot as plt
import numpy as np

# Data for urban and rural student enrollment rates and dropout rates
categories = ['Primary Enrollment (%)', 'Private Schools (%)', 'Government Schools (%)', 'Dropout Rates (%)']
urban_data = [26.63, 70.04, 29.96, 8.7]  # Discussed percentages
rural_data = [73.37, 26.74, 73.26, 11.2]  # Discussed percentages

# Bar positions
x = np.arange(len(categories))

# Width of bars
width = 0.3

# Plotting the bar chart
fig, ax = plt.subplots(figsize=(10, 6))

# Create bars for urban and rural data
rects1 = ax.bar(x - width/2, urban_data, width, label='Urban', color='skyblue')
rects2 = ax.bar(x + width/2, rural_data, width, label='Rural', color='lightcoral')

# Adding labels, title, and custom x-axis tick labels
ax.set_xlabel('Categories')
ax.set_ylabel('Percentage (%)')
ax.set_title('Comparison of Urban vs. Rural Primary Education Metrics')
ax.set_xticks(x)
ax.set_xticklabels(categories, rotation=45, ha="right")
ax.legend()

# Function to add labels on top of the bars
def add_labels(rects):
    for rect in rects:
        height = rect.get_height()
        ax.annotate(f'{height:.2f}%',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom')

# Add labels to bars
add_labels(rects1)
add_labels(rects2)

# Show the plot
plt.tight_layout()
plt.savefig('urban_rural_education_metrics.png', format='png', dpi=300)
plt.show()

# Additional explanatory paragraph
paragraph = """
The chart compares Urban and Rural primary education metrics for 2022-23. Urban areas exhibit a higher percentage of private school enrollment (70.04%) compared to rural areas (26.74%), highlighting a reliance on private institutions in cities. Conversely, rural areas have a higher government school enrollment rate (73.26%), reflecting the role of public education in rural settings. Dropout rates are derived from 2017-18 data as current figures are unavailable; rural areas show a dropout rate of 11.2%, which is higher than the 8.7% seen in urban areas. This disparity underscores challenges like access and quality differences in rural education. 

Sources: Derived from enrollment data for 2022-23 and dropout rates from 2017-18 (latest available).
"""
print(paragraph)
