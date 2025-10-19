# Chicago AirBnB Market Analysis - Visual Data Science Project

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![Data Science](https://img.shields.io/badge/Data%20Science-Workflow-green.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-In%20Progress-yellow.svg)](https://github.com)

## 🎯 Project Overview

This project analyzes the Chicago AirBnB market to understand the relationship between crime rates, geographic location, and listing prices. Using advanced data science methods including spatial analysis, clustering, and predictive modeling, we uncover actionable insights for hosts, guests, and urban planners.

### Key Research Questions

1. **Geographic Distribution**: How are AirBnB listings distributed across Chicago?
2. **Crime Impact**: What is the relationship between crime rates and AirBnB pricing?
3. **Price Prediction**: What factors most strongly predict listing prices?

---

## 🚀 Getting Started

### Quick Start

1. **Activate virtual environment**
```bash
source ABNBVENV/bin/activate  # macOS/Linux
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Open improved notebook**
```bash
jupyter notebook VisualDS.ipynb
```

### Python Version
We're using Python 3.11 for this project.

---

## 📊 Project Files

- **VisualDS.ipynb** ✨ - Improved analysis notebook with beautiful visualizations
- **main.ipynb** - Original analysis notebook
- **PLAN.md** / **instructions/Exercise-Plan.md** - Comprehensive execution plan
- **PROJECT_OVERVIEW.md** - Executive summary of improvements
- **instructions/** - PDF requirements and exercise descriptions
- **submissions/** - Final reports (to be created)
- **imgs/** - All generated visualizations

---

## 🎨 What's New in VisualDS.ipynb

### Improvements over Original

1. **Professional Visualizations**
   - Publication-quality plots with proper styling
   - Colorblind-friendly palettes
   - Clear titles, labels, and annotations
   - High resolution (300 DPI)

2. **Better Code Structure**
   - Centralized configuration
   - Reusable utility functions
   - Clear section organization
   - Comprehensive error handling

3. **Enhanced Features**
   - Distance calculations
   - Amenity extraction
   - Price ratios and categories
   - Geographic indicators

4. **Detailed Documentation**
   - Clear markdown explanations
   - Results interpretation
   - Key findings summarized
   - Reproducible workflow

---

## 📈 Current Status

### Completed ✅
- Exercise plan and documentation
- Data loading and exploration
- Data cleaning and transformation
- Feature engineering
- Geographic price analysis (Insight 1)
- Correlation analysis (Insight 3)

### In Progress 🚧
- Crime-AirBnB relationship analysis (Insight 2)
- Unsupervised learning (clustering, association rules)
- Predictive modeling (Linear, RF, XGBoost)
- Trust-building visualizations
- Submission reports

---

## 📝 Deliverables

Three reports required:
1. **Discover-Submission.md** (1-2 pages) - Topic and dataset descriptions
2. **Wrangle-Profile-Submission.md** (1.5-2.5 pages) - Cleaning and 3 insights
3. **Model-Submission.md** (1-1.5 pages) - Modeling approach and trust visualizations

---

## 🔧 Technical Details

- **Geographic CRS**: EPSG:26916 (UTM Zone 16N) for distance calculations
- **Random State**: 42 for reproducibility
- **Feature Sets**: Testing 10, 15, and 20 features
- **Models**: Linear Regression, Random Forest, XGBoost

---

## 📚 Data Sources

- **AirBnB**: Inside AirBnB (http://insideairbnb.com/)
- **Crime**: Chicago Data Portal
- **Population**: Chicago Data Portal
- **Amenities**: City of Chicago shapefiles

---

## 🤝 Code Quality

Following professional standards:
- Lowercase comments only (minimal, when needed)
- Clear variable naming (lowercase with underscores)
- No emojis in code
- Type hints where helpful
- Vectorized operations for efficiency

---

**Last Updated**: October 19, 2025
**Version**: 2.0 (Improved)
