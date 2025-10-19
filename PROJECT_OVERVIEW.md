# Chicago AirBnB Data Science Project - Overview

## Project Refinement Complete ✓

This document summarizes the improvements made to the Chicago AirBnB analysis project.

---

## What Was Done

### 1. Comprehensive Exercise Plan Created ✓

**File**: `instructions/Exercise-Plan.md`

A detailed, actionable plan based on the actual PDF requirements that includes:

- **Stage 1: Discover**
  - Detailed description of all 4 datasets (AirBnB, Crime, Population, Amenities)
  - Data source documentation with proper citations
  - Initial exploration tasks
  - Deliverables: 1-2 page report with visualizations

- **Stage 2: Wrangle & Profile**
  - Complete data joining strategy (spatial joins via geographic coordinates)
  - Data cleaning steps (price parsing, amenity extraction, outlier removal)
  - Feature engineering approach (crime density, distance metrics, property ratios)
  - Three required insights with visualization specifications
  - Deliverables: 1.5-2.5 page report with 3 insights

- **Stage 3: Model**
  - Unsupervised learning: K-means clustering & association rules
  - Feature selection: RFE with 10, 15, 20 features
  - Supervised learning: Linear Regression, Random Forest, XGBoost
  - Trust-building visualization strategy
  - Deliverables: 1-1.5 page report with 5+ visualizations

---

## Key Improvements in the Plan

### 1. Based on Actual Requirements
- Extracted text from all three PDF instruction files
- Matched plan exactly to assignment requirements
- Added specific page length requirements
- Included exact questions to answer

### 2. Enhanced Visualization Guidelines
- Professional design principles
- Specific color palettes (colorblind-friendly)
- Technical standards (titles, labels, annotations)
- Library recommendations (Seaborn, Plotly, GeoPandas)
- File naming conventions
- Saving specifications (DPI 300, proper formats)

### 3. Comprehensive Code Quality Standards
- Naming conventions (lowercase with underscores)
- Comment guidelines (lowercase only, explain why not what, no emojis)
- Function design principles (single responsibility, < 20 lines)
- Code organization (notebook structure, cell organization)
- Best practices (vectorization, efficient pandas)
- Error handling patterns

### 4. Detailed Technical Specifications
- **Data Sources**: Direct links and file locations
- **CRS Information**: Input (EPSG:4326), Working (EPSG:26916)
- **Feature Engineering**: Specific calculations documented
- **Model Parameters**: Training approach, evaluation metrics
- **Visualization Types**: Specific chart recommendations per stage

### 5. Actionable Deliverables Checklist
- Week-by-week timeline
- Deliverables checklist with page requirements
- Success criteria (technical, visualization, analysis, communication)
- Common pitfalls to avoid

---

## Next Steps

### Step 2: Create Improved Notebook
**File**: `VisualDS.ipynb`

Will include:
- Clean, modular code structure
- Professional visualizations with proper styling
- Enhanced feature engineering
- Comprehensive model evaluation
- Management-ready outputs

### Step 3: Create Submission Reports

Three markdown reports in `submissions/` folder:

1. **Discover-Submission.md** (1-2 pages)
   - Topic description
   - Dataset descriptions with sources
   - Initial geographic visualizations

2. **Wrangle-Profile-Submission.md** (1.5-2.5 pages)
   - Data joining strategy and challenges
   - Data cleaning steps and solutions
   - Three insights with professional visualizations

3. **Model-Submission.md** (1-1.5 pages)
   - Modeling approach description
   - Trust-building visualizations
   - Performance metrics and business insights

---

## Technical Setup

### Environment
- Python 3.11 in virtual environment (`ABNBVENV`)
- All required packages documented in plan
- Geographic data processing capability

### Data Structure
```
data/
├── airbnb_data/listings.csv
├── crime_data/Chicago_Police_Department_-_Illinois_Uniform_Crime_Reporting__IUCR__Codes.csv
└── population_data/
    ├── CensusTractsTIGER2010.csv
    ├── Population_by_2010_Census_Block.csv
    └── shapefiles (parks, boulevards, riverwalk)
```

### Output Structure
```
imgs/                          # All visualizations saved here
├── 01_discover_*.png
├── 02_wrangle_*.png
├── 03_profile_*.png
├── 04_model_*.png
└── 05_model_*.png

submissions/                   # Reports go here
├── Discover-Submission.md
├── Wrangle-Profile-Submission.md
└── Model-Submission.md
```

---

## Key Project Insights (from Original Analysis)

### Geographic Patterns
- Higher AirBnB density in north Chicago
- Crime density higher in southwest areas
- Clear north-south divide in both metrics

### Price Drivers
1. Homicide density (surprisingly important)
2. Number of bedrooms/beds
3. Distance to city center
4. Key amenities (WiFi, parking)
5. Host characteristics

### Model Performance
- Random Forest performed best
- More features improved accuracy
- R² around 0.4-0.6 (moderate predictive power)
- Crime rate has measurable impact on pricing

---

## Writing Guidelines

All reports must use:
- **Basic English**: No complex or unusual words
- **Pointed statements**: Clear, direct communication
- **Lowercase comments**: In code only
- **No emojis**: Professional tone throughout
- **Simple structure**: Easy to follow logic

---

## Quality Checklist

### Code Quality
- [ ] Functions have clear names
- [ ] Comments are lowercase and minimal
- [ ] No unnecessary complexity
- [ ] Vectorized operations used
- [ ] Type hints where helpful

### Visualization Quality
- [ ] Publication-ready appearance
- [ ] All axes labeled with units
- [ ] Professional color schemes
- [ ] Annotations highlight insights
- [ ] Saved at 300 DPI

### Report Quality
- [ ] Meets page length requirements
- [ ] Answers all required questions
- [ ] Uses basic English
- [ ] Includes required visualizations
- [ ] Clear structure and flow

---

## Contact & Resources

### Reference Documents
- Original notebook: `main.ipynb`
- Exercise plan: `instructions/Exercise-Plan.md`
- PDF requirements: `instructions/*.pdf`

### Data Science Process
1. **Discover**: Understand data and sources
2. **Wrangle**: Clean and integrate data
3. **Profile**: Explore and find insights
4. **Model**: Build predictive models
5. **Communicate**: Share findings clearly

---

## Status

✅ **Exercise Plan Created** - Comprehensive, actionable plan ready
⏳ **Improved Notebook** - Next step
⏳ **Submission Reports** - Final step

Ready to proceed with creating the improved `VisualDS.ipynb` notebook!
