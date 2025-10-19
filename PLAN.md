# Exercise Plan: Chicago AirBnB Data Science Project

## Overview
This project analyzes the Chicago AirBnB market, focusing on the relationship between crime rates, property characteristics, and pricing. The analysis follows a structured data science workflow: Discover, Wrangle/Profile, and Model.

---

## Stage 1: Discover (Data Gathering)

**Report Length**: 1-2 A4 pages

### Assignment Requirements
From the instructions, the report must answer:
1. Describe your topic
2. Describe the two datasets you selected

### Our Project Topic
Analyze Chicago AirBnB listings and their relationship with crime rates, population density, and city amenities to understand pricing patterns and predict listing prices.

### Primary Research Questions
- Q1: Can we analyze and predict the locations of AirBnBs within Chicago?
- Q2: What are the influencing factors behind AirBnB prices, and can we model this meaningfully?

### Datasets Selected

#### Dataset 1: AirBnB Listings Data
- **Source**: Inside AirBnB (http://insideairbnb.com/get-the-data/)
- **File**: `data/airbnb_data/listings.csv`
- **Description**: Complete listing information for Chicago AirBnB properties
- **Key Features**:
  - Geographic coordinates (latitude, longitude)
  - Price information
  - Property characteristics (bedrooms, beds, accommodates)
  - Amenities (nested list structure)
  - Host information
  - Review scores
  - Availability data
- **Size**: Multiple columns with detailed property information
- **Data Quality Issues**: 
  - Price stored as string with $ sign
  - One outlier listing at $9,999,999
  - Amenities stored as string representation of list
  - Some missing values (< 1%)

#### Dataset 2: Chicago Crime Data
- **Source**: Chicago Data Portal
- **File**: Crime data from 2018-present
- **Description**: Individual crime incidents reported in Chicago
- **Key Features**:
  - Crime type and classification (IUCR codes)
  - Geographic coordinates (latitude, longitude)
  - Date and time of incident
  - Location description
  - Arrest status
- **Focus Area**: Homicide data for safety analysis
- **Size**: Large dataset requiring filtering
- **Data Quality Issues**: 
  - Very large file size requiring efficient processing
  - Requires geographic projection transformation

#### Supporting Dataset 3: Population & Census Data
- **Source**: Chicago Data Portal
- **Files**: 
  - `CensusTractsTIGER2010.csv`
  - `Population_by_2010_Census_Block.csv`
- **Description**: Geographic boundaries and population statistics
- **Purpose**: Common geographic framework for data integration
- **Key Features**:
  - Census tract boundaries as polygons
  - Population counts by area
  - Used for normalizing crime and listing density

#### Supporting Dataset 4: City Amenities
- **Source**: Chicago Data Portal
- **Files**: Shapefiles for parks, boulevards, riverwalks
- **Description**: Geographic data for city amenities
- **Purpose**: Understand proximity effects on AirBnB listings
- **Key Features**:
  - Park locations and boundaries
  - Boulevard locations
  - Riverwalk paths

### Initial Data Exploration Tasks
1. Load all datasets and verify structure
2. Check coordinate reference systems (CRS)
3. Transform all geographic data to common projection (EPSG:26916)
4. Create initial geographic visualizations
5. Document data sources with proper citations
6. Identify data quality issues and outliers
7. Calculate basic statistics for each dataset

### Deliverables for Stage 1
- Comprehensive data source documentation
- Initial data quality assessment
- Geographic visualization showing:
  - AirBnB listing distribution
  - Crime incident locations (homicides)
  - Population density
  - City amenities overlay
- Submission report: `submissions/Discover-Submission.md` (1-2 pages)

---

## Stage 2: Wrangle & Profile

**Report Length**: 1.5-2.5 A4 pages total

### Assignment Requirements
The report must address:
1. **Wrangle Stage** (½ to 1 page):
   - a) How did you join the datasets? Which keys? Did all keys match?
   - b) Which data cleaning steps were necessary? What issues did you encounter?
   - c) OPTIONAL: Visual representation of data quality
   
2. **Profile Stage** (¾ to 1 page per insight):
   - Three insights, each with text description and one visualization

### Wrangle Tasks

#### Data Joining Strategy
1. **Primary Key**: Geographic location
   - Transform all datasets to common CRS (EPSG:26916)
   - Use spatial joins based on point-in-polygon relationships
   - Join AirBnB listings to census tracts via coordinates
   - Join crime incidents to census tracts via coordinates
   
2. **Key Challenges**:
   - Different coordinate systems across datasets
   - No direct ID-based keys available
   - Need to create spatial relationships
   - Handle listings/crimes outside census boundaries

3. **Join Process**:
   - Convert latitude/longitude to GeoDataFrame points
   - Transform to UTM projection (EPSG:26916)
   - Spatial join with census tract polygons
   - Aggregate crime data by census tract
   - Merge aggregated data with listing data

#### Data Cleaning Steps

1. **Price Field Cleaning**
   - Remove $ symbol from price strings
   - Convert to float type
   - Remove outlier: $9,999,999 listing
   - Handle missing price values (drop < 1%)

2. **Amenities Parsing**
   - Parse string representation of lists: "['WiFi', 'Kitchen']"
   - Extract individual amenities
   - Create binary dummy variables for each amenity
   - Handle missing amenities (empty lists)

3. **Geographic Data**
   - Verify all coordinates fall within Chicago boundaries
   - Remove listings with invalid coordinates
   - Standardize projection across all datasets
   - Handle edge cases at boundary limits

4. **Missing Values**
   - Identify missing values across all fields
   - Drop rows with < 1% missing data
   - Document which fields had missing data
   - Verify impact on analysis

5. **Crime Data Filtering**
   - Filter to relevant time period (2018-present)
   - Focus on homicide data for safety metric
   - Remove duplicate incidents
   - Aggregate by geographic area

#### Feature Engineering

1. **Crime Metrics**
   - Calculate crime density within 2km radius of each listing
   - Compute homicides per census tract
   - Normalize by area (crimes per km²)
   - Create safety score metric

2. **Geographic Features**
   - Distance to city center (Chicago Loop)
   - Distance to nearest park
   - Proximity to boulevards and riverwalk
   - Census tract population density

3. **Property Metrics**
   - Price per bedroom
   - Price per bed
   - Price per person (based on accommodates)
   - Occupancy efficiency ratios

4. **Amenity Features**
   - Count of total amenities
   - Binary flags for key amenities
   - Amenity categories (tech, comfort, kitchen, etc.)

### Profile Tasks: Three Key Insights

#### Insight 1: Geographic Price Distribution
**Question**: How do AirBnB prices vary across Chicago neighborhoods?

**Analysis**:
- Price distribution by geographic area
- Identify high-value vs low-value neighborhoods
- Compare north vs south Chicago
- Analyze density of listings by area

**Visualization**: 
- Choropleth map of average prices by census tract
- OR violin plot of price distributions by major neighborhoods
- Include statistical annotations

#### Insight 2: Crime and Listing Relationship
**Question**: Is there a relationship between crime rates and AirBnB characteristics?

**Analysis**:
- Correlation between crime density and number of listings
- Price relationship with safety metrics
- Geographic overlay of crime hotspots and AirBnB density
- North-south divide in safety and listings

**Visualization**:
- Dual-layer map showing crime density and AirBnB locations
- OR scatter plot with trend line showing price vs crime rate
- Include correlation statistics

#### Insight 3: Feature Correlations
**Question**: Which features are most strongly correlated with price?

**Analysis**:
- Correlation matrix of all features
- Identify strongest predictors
- Unexpected relationships
- Multicollinearity concerns

**Visualization**:
- Correlation heatmap with annotations
- Focus on price correlations
- Highlight significant relationships (|r| > 0.3)

### Optional: Data Quality Visualization
Creative visual representation showing:
- Completeness before and after cleaning
- Coverage of geographic areas
- Distribution of data across census tracts
- Impact of outlier removal
- Success rate of spatial joins

### Deliverables for Stage 2
- Clean, integrated dataset ready for modeling
- Feature engineering code and documentation
- Three insight visualizations (professional quality)
- Written analysis of each insight
- Submission report: `submissions/Wrangle-Profile-Submission.md` (1.5-2.5 pages)

---

## Stage 3: Model

**Report Length**: 1-1.5 A4 pages total

### Assignment Requirements
The report must address:
1. **Describe your modeling approach** (½ page)
   - What models did you use and why?
   - What was your evaluation strategy?
   - What were the results?
   
2. **How would you increase trust in your modeling approach using visualization?** (½ to 1 page)
   - What visualizations help stakeholders understand the model?
   - How do you communicate model performance?
   - How do you show model reliability?

### Modeling Approach

#### Unsupervised Learning

**1. K-Means Clustering**
- **Purpose**: Segment AirBnB listings into distinct groups
- **Features**: Price, location, property size, amenities
- **Method**: 
  - Test multiple k values (3-6 clusters)
  - Use elbow method to select k=4
  - Analyze cluster characteristics
- **Output**: 
  - Cluster assignments for each listing
  - Geographic visualization of clusters
  - Cluster profiles (average characteristics)

**2. Association Rule Learning**
- **Purpose**: Discover amenity co-occurrence patterns
- **Method**: 
  - Transform amenities to transaction format
  - Apply Apriori algorithm
  - Set minimum support and confidence thresholds
- **Insights**:
  - Which amenities frequently appear together?
  - Common amenity bundles
  - Unexpected associations
- **Output**: 
  - Association rules with support/confidence metrics
  - Network visualization of amenity relationships

#### Feature Selection

**Recursive Feature Elimination (RFE)**
- **Purpose**: Identify most important features for price prediction
- **Method**: 
  - Use Random Forest as base estimator
  - Test three feature sets: 10, 15, and 20 features
  - Compare model performance across feature counts
- **Features Considered**:
  - Geographic: crime density, distance to center, neighborhood
  - Property: bedrooms, beds, accommodates, property type
  - Amenities: WiFi, kitchen, parking, etc.
  - Market: number of reviews, availability
  - Host: superhost status, response rate
- **Output**: 
  - Ranked feature importance
  - Selected features for each model size
  - Performance comparison across feature counts

#### Supervised Learning: Price Prediction

**Models to Compare**:

1. **Baseline: Linear Regression**
   - Simple, interpretable model
   - Establishes minimum performance threshold
   - Shows linear relationships

2. **Random Forest Regressor**
   - Handles non-linear relationships
   - Provides feature importance
   - Resistant to outliers
   - Main model for comparison

3. **XGBoost Regressor**
   - Gradient boosting approach
   - Often best performance
   - Handles complex interactions

**Model Training Process**:
1. Split data: 80% training, 20% testing
2. Scale features using StandardScaler
3. Train all three models with 10, 15, and 20 features
4. Evaluate on test set
5. Compare performance metrics

**Evaluation Metrics**:
- **MSE** (Mean Squared Error): Average squared prediction error
- **MAE** (Mean Absolute Error): Average absolute prediction error
- **RMSE** (Root Mean Squared Error): Standard deviation of errors
- **R²** (R-squared): Proportion of variance explained

### Building Trust Through Visualization

#### 1. Model Performance Visualizations

**Actual vs Predicted Scatter Plot**
- Shows prediction accuracy visually
- Perfect predictions fall on diagonal line
- Reveals systematic biases
- Easy for non-technical stakeholders
- Create for each model (10, 15, 20 features)

**Metric Comparison Chart**
- Bar chart comparing R² across models
- Line chart showing improvement with feature count
- Clear visual ranking of model performance
- Highlights best performing approach

#### 2. Feature Importance Visualizations

**Feature Importance Bar Chart**
- Shows which features drive predictions
- Ranked by importance score
- Helps stakeholders understand what matters
- Validates business intuition
- One chart for top 20 features

**Feature Impact Examples**
- Show how top feature affects price
- Scatter plot: crime rate vs price
- Scatter plot: number of bedrooms vs price
- Demonstrates logical relationships

#### 3. Model Reliability Visualizations

**Residual Plot**
- Difference between actual and predicted
- Should show random scatter (no patterns)
- Identifies where model struggles
- Reveals potential biases

**Error Distribution**
- Histogram of prediction errors
- Should be normally distributed
- Shows typical error magnitude
- Helps set realistic expectations

**Cluster Performance**
- Model performance by cluster
- Shows if model works for all segments
- Identifies underserved groups
- Ensures fairness

#### 4. Geographic Validation

**Map of Prediction Errors**
- Geographic visualization of model accuracy
- Identifies areas with poor predictions
- Reveals spatial patterns in errors
- Helps understand model limitations

**Price Heatmap: Actual vs Predicted**
- Side-by-side geographic comparison
- Visual validation of spatial patterns
- Easy for stakeholders to verify
- Shows model captures geographic effects

### Key Insights to Communicate

1. **Top Price Predictors**:
   - Homicide density (surprisingly important)
   - Number of bedrooms/beds
   - Location (distance to center)
   - Key amenities
   - Host characteristics

2. **Model Performance**:
   - Random Forest performs best
   - More features improve accuracy
   - R² around 0.4-0.6 (moderate predictive power)
   - Typical error: $X per night

3. **Business Insights**:
   - Safety perception affects pricing
   - Property size is key driver
   - Location premium in north Chicago
   - Certain amenities add significant value

4. **Model Limitations**:
   - Cannot capture all market dynamics
   - Some high-value listings poorly predicted
   - Seasonal effects not included
   - Limited to Chicago market

### Deliverables for Stage 3
- Trained models (all combinations: 3 models × 3 feature sets = 9 models)
- Performance metrics table
- Feature importance analysis
- Minimum 5 trust-building visualizations:
  1. Actual vs Predicted plot (best model)
  2. Model comparison chart
  3. Feature importance bar chart
  4. Residual plot
  5. Geographic error map
- Business insights summary
- Submission report: `submissions/Model-Submission.md` (1-1.5 pages)

---

## Visualization Requirements

### Design Principles

All visualizations must be **management-ready** and **publication-quality**:

1. **Clarity**: Immediately understandable without explanation
2. **Completeness**: All axes labeled with units, title, legend when needed
3. **Aesthetics**: Professional color schemes, proper spacing, readable fonts
4. **Insight**: Highlight key findings with annotations or callouts

### Technical Standards

#### Every Plot Must Include:
- **Title**: Clear, descriptive (14-16pt font)
- **Subtitle**: Additional context when needed (10-12pt font)
- **Axis Labels**: Full description with units (e.g., "Price per Night (USD)")
- **Legend**: When multiple series, positioned appropriately
- **Annotations**: Key values, trends, or insights highlighted
- **Source**: Data source citation in small text
- **Color Scheme**: Professional, accessible (colorblind-friendly)

#### Recommended Libraries

1. **Seaborn**: Statistical plots with better defaults
   - Distribution plots (violin, box, kde)
   - Correlation heatmaps
   - Categorical plots
   - Pair plots

2. **Matplotlib** with custom styling:
   - Base for all plots
   - Use `plt.style.use('seaborn-v0_8-darkgrid')` or custom style
   - Set figure size appropriately: `figsize=(12, 8)`
   - High DPI for saving: `dpi=300`

3. **Plotly**: Interactive visualizations
   - Geographic maps with hover details
   - 3D scatter plots
   - Interactive filtering
   - Exportable as HTML

4. **GeoPandas**: Geographic visualizations
   - Choropleth maps
   - Point overlays on maps
   - Census tract visualizations
   - Multiple layer maps

### Color Palette Standards

Use professional, accessible color schemes:

**Primary Palette** (for categories):
```python
colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E']
```

**Sequential** (for continuous data):
```python
import seaborn as sns
sns.color_palette("YlOrRd", as_cmap=True)  # for heat
sns.color_palette("Blues", as_cmap=True)   # for density
```

**Diverging** (for correlation):
```python
sns.color_palette("RdBu_r", as_cmap=True)  # red-blue reversed
```

### Key Visualizations by Stage

#### Stage 1: Discover
1. **Multi-layer Chicago Map**
   - Base: Census tracts with population density
   - Layer 1: AirBnB locations (colored by price)
   - Layer 2: Crime incidents (homicides as heatmap)
   - Layer 3: Parks and amenities
   - Use transparency for overlapping layers

2. **Data Completeness Dashboard**
   - Bar charts showing missing data by field
   - Geographic coverage map

#### Stage 2: Wrangle & Profile
1. **Price Distribution by Neighborhood** (Insight 1)
   - Violin plot or box plot with swarm
   - Show median, quartiles, outliers
   - Sort by median price
   - Use color gradient

2. **Crime vs AirBnB Analysis** (Insight 2)
   - Dual-axis heatmap or scatter plot
   - Regression line with confidence interval
   - Correlation coefficient annotated
   - Geographic overlay option

3. **Correlation Heatmap** (Insight 3)
   - All features vs price
   - Annotate correlation values
   - Mask upper triangle
   - Highlight strong correlations (|r| > 0.3)

#### Stage 3: Model
1. **Actual vs Predicted Scatter**
   - 45-degree reference line
   - Color points by error magnitude
   - Add R² and RMSE in text box
   - Include marginal distributions

2. **Model Comparison Chart**
   - Grouped bar chart: MSE, MAE, R² for each model
   - Multiple subplots for different feature counts
   - Clear winner highlighted

3. **Feature Importance**
   - Horizontal bar chart (easier to read labels)
   - Top 20 features only
   - Color by feature category
   - Include importance values

4. **Residual Analysis**
   - Residual vs predicted plot
   - Histogram of residuals
   - Q-Q plot for normality check

5. **Geographic Error Map**
   - Choropleth of average error by area
   - Identify problem regions
   - Use diverging colormap (red = overpredict, blue = underpredict)

### Saving Visualizations

Save all figures in high quality:
```python
plt.savefig('imgs/figure_name.png', dpi=300, bbox_inches='tight', facecolor='white')
```

Name files descriptively:
- `01_discover_chicago_overview_map.png`
- `02_wrangle_price_distribution_violin.png`
- `03_profile_crime_airbnb_correlation.png`
- `04_model_actual_vs_predicted_rf.png`
- `05_model_feature_importance_top20.png`

---

## Code Quality Standards

### Style Guidelines

#### Naming Conventions
- **Variables**: lowercase with underscores: `airbnb_data`, `crime_density`
- **Functions**: lowercase with underscores: `calculate_distance()`, `plot_heatmap()`
- **Constants**: uppercase: `CHICAGO_CENTER_LAT`, `EPSG_CODE`
- **Classes**: PascalCase: `DataProcessor`, `FeatureEngineer`

#### Comments
- Use **lowercase only** for all comments
- Comment **sparingly** - only when needed
- Explain **why**, not **what** (code should be self-explanatory)
- **No emojis**

```python
# good: explain complex logic
# calculate crime density using 2km radius buffer
crime_density = calculate_spatial_density(crimes, radius=2000)

# bad: stating the obvious  
# loop through the data frame
for idx, row in df.iterrows():
```

#### Function Design
- **Single responsibility**: Each function does one thing well
- **Short and focused**: Aim for < 20 lines
- **Type hints**: Use when helpful for clarity
- **Docstrings**: For complex functions only

```python
def calculate_distance_to_center(lat: float, lon: float) -> float:
    """calculate euclidean distance from point to chicago center"""
    center_point = Point(CHICAGO_CENTER_LON, CHICAGO_CENTER_LAT)
    point = Point(lon, lat)
    return center_point.distance(point)
```

### Code Organization

#### Notebook Structure
1. **Imports** (one cell)
   - Group by purpose: data, visualization, modeling
   - Sort alphabetically within groups

2. **Configuration** (one cell)
   - File paths
   - Constants
   - Plot styling

3. **Function Definitions** (one cell per major section)
   - Data loading functions
   - Cleaning functions
   - Feature engineering functions
   - Plotting functions

4. **Analysis Sections** (multiple cells)
   - Clear markdown headers
   - Execute step by step
   - Show intermediate results

#### Cell Organization
- One logical operation per cell
- Clear output after each cell
- Markdown explanation before complex cells
- Results interpretation after key cells

### Best Practices

#### Data Loading
```python
# efficient loading with type specification
dtypes = {
    'id': 'int64',
    'price': 'str',  # will clean later
    'latitude': 'float64',
    'longitude': 'float64'
}

df = pd.read_csv('data/listings.csv', dtype=dtypes, low_memory=False)
```

#### Data Cleaning
```python
# chain operations for clarity
df_clean = (df
    .drop_duplicates()
    .dropna(subset=['price', 'latitude', 'longitude'])
    .query('price < 1000')  # remove extreme outliers
    .reset_index(drop=True)
)
```

#### Feature Engineering
```python
# create features with meaningful names
df['price_per_bedroom'] = df['price'] / df['bedrooms'].replace(0, 1)
df['has_wifi'] = df['amenities'].str.contains('WiFi', case=False)
df['is_north_chicago'] = df['latitude'] > CHICAGO_CENTER_LAT
```

#### Plotting
```python
# consistent plotting function
def create_scatter_plot(x, y, title, xlabel, ylabel, filename=None):
    """create publication-quality scatter plot"""
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.scatter(x, y, alpha=0.5, s=50, c='#2E86AB')
    ax.set_xlabel(xlabel, fontsize=12)
    ax.set_ylabel(ylabel, fontsize=12)
    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.grid(True, alpha=0.3)
    
    if filename:
        plt.savefig(f'imgs/{filename}', dpi=300, bbox_inches='tight')
    
    plt.show()
```

### Error Handling

```python
# handle potential issues gracefully
try:
    df_spatial = gpd.sjoin(listings_gdf, census_gdf, how='left', predicate='within')
except Exception as e:
    print(f"spatial join failed: {e}")
    # fallback approach
    df_spatial = nearest_join(listings_gdf, census_gdf)
```

### Performance Considerations

```python
# vectorized operations (fast)
df['log_price'] = np.log1p(df['price'])

# avoid loops when possible (slow)
# for idx, row in df.iterrows():
#     df.loc[idx, 'log_price'] = np.log1p(row['price'])

# use apply for complex operations
df['amenity_count'] = df['amenities'].apply(lambda x: len(eval(x)) if x else 0)
```

### Code Review Checklist
- [ ] All functions have clear, descriptive names
- [ ] Comments are lowercase and explain why, not what
- [ ] No unnecessary comments or emojis
- [ ] Type hints used where helpful
- [ ] Code is DRY (don't repeat yourself)
- [ ] Plots have titles, labels, and legends
- [ ] Files saved with descriptive names
- [ ] No magic numbers (use named constants)
- [ ] Efficient pandas operations (vectorized)
- [ ] Clear separation of concerns

---

## Project Timeline

### Week 1: Discover & Setup
- [ ] Read all PDF instructions
- [ ] Set up environment and install packages
- [ ] Load all datasets
- [ ] Initial data exploration
- [ ] Create geographic visualizations
- [ ] Write Discover submission report

### Week 2: Wrangle & Feature Engineering
- [ ] Clean all datasets
- [ ] Implement spatial joins
- [ ] Engineer features
- [ ] Create three profile insights
- [ ] Generate professional visualizations
- [ ] Write Wrangle-Profile submission report

### Week 3: Modeling & Analysis
- [ ] Implement K-means clustering
- [ ] Run association rule mining
- [ ] Feature selection with RFE
- [ ] Train all models (3 models × 3 feature sets)
- [ ] Evaluate and compare models
- [ ] Create trust-building visualizations
- [ ] Write Model submission report

### Week 4: Refinement & Documentation
- [ ] Review all code for quality
- [ ] Improve visualizations
- [ ] Final report reviews
- [ ] Create presentation materials
- [ ] Final testing and validation

---

## Deliverables Checklist

### Code & Notebooks
- [ ] `VisualDS.ipynb` - Improved analysis notebook
- [ ] All visualizations saved in `imgs/` folder
- [ ] Clean, well-commented code
- [ ] Reproducible results

### Submission Reports
- [ ] `submissions/Discover-Submission.md` (1-2 pages)
  - [ ] Topic description
  - [ ] Dataset descriptions
  - [ ] Data source citations
  - [ ] Initial visualizations
  
- [ ] `submissions/Wrangle-Profile-Submission.md` (1.5-2.5 pages)
  - [ ] Join strategy explanation
  - [ ] Data cleaning documentation
  - [ ] Three insights with visualizations
  - [ ] Optional: data quality visualization
  
- [ ] `submissions/Model-Submission.md` (1-1.5 pages)
  - [ ] Modeling approach description
  - [ ] Trust-building visualizations
  - [ ] Performance metrics
  - [ ] Business insights

### Supporting Files
- [ ] `instructions/Exercise-Plan.md` (this document)
- [ ] Updated `README.md` with project overview
- [ ] `requirements.txt` with all dependencies

---

## Success Criteria

### Technical Excellence
- ✓ Clean, maintainable, well-documented code
- ✓ Efficient data processing and modeling
- ✓ Proper use of data science methods
- ✓ Reproducible analysis pipeline

### Visualization Quality
- ✓ Publication-ready, professional visualizations
- ✓ Clear communication of insights
- ✓ Appropriate chart types for data
- ✓ Accessible color schemes and labels

### Analysis Depth
- ✓ Meaningful insights from data
- ✓ Multiple modeling approaches compared
- ✓ Feature importance understood
- ✓ Model limitations acknowledged

### Communication
- ✓ Clear, concise writing (basic English)
- ✓ Well-structured reports
- ✓ Appropriate length and detail
- ✓ Business-ready insights

---

## Resources & References

### Libraries Required
```
pandas>=1.5.0
numpy>=1.23.0
geopandas>=0.12.0
shapely>=2.0.0
matplotlib>=3.6.0
seaborn>=0.12.0
plotly>=5.11.0
scikit-learn>=1.2.0
xgboost>=1.7.0
mlxtend>=0.21.0  # for association rules
```

### Data Sources
- **AirBnB Data**: http://insideairbnb.com/get-the-data/
- **Chicago Crime Data**: https://data.cityofchicago.org/
- **Census Data**: https://data.cityofchicago.org/
- **Geographic Boundaries**: Chicago Data Portal

### Coordinate Reference Systems
- **Input**: WGS84 (EPSG:4326) - standard lat/lon
- **Working**: UTM Zone 16N (EPSG:26916) - for distance calculations
- **Output**: WGS84 (EPSG:4326) - for final maps

---

## Notes

### Key Findings from Original Analysis
1. Higher AirBnB density in north Chicago
2. Homicide density is surprisingly important predictor
3. Random Forest outperforms other models
4. Property size (bedrooms/beds) is key driver
5. Crime rate has measurable impact on pricing

### Improvements in New Notebook
1. Better code structure and organization
2. Professional, publication-quality visualizations
3. Enhanced feature engineering
4. More comprehensive model evaluation
5. Better documentation and explanations
6. Management-ready reports

### Common Pitfalls to Avoid
- Don't forget to transform CRS before spatial operations
- Don't use loops where vectorization is possible
- Don't create plots without proper labels and titles
- Don't skip data quality checks
- Don't overfit models (use train-test split)
- Don't forget to document assumptions
- Don't use complex language in reports