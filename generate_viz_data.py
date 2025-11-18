import pandas as pd
import json
import os

def generate_data():
    print("Loading data...")
    
    # Paths
    crime_path = 'crime.csv'
    listings_path = 'data/airbnb_data/listings.csv.gz'
    output_path = 'src/data/chicago_timeseries.json'
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 1. Load Listings
    print("Loading listings...")
    try:
        df_listings = pd.read_csv(listings_path, compression='gzip')
    except Exception:
        # Fallback if not gzipped or different path
        df_listings = pd.read_csv('data/airbnb_data/listings.csv')

    # 2. Load Crime Data
    print("Loading crime data...")
    # Read only necessary columns to save memory
    crime_cols = ['Date', 'Primary Type', 'Latitude', 'Longitude']
    df_crime = pd.read_csv(crime_path, usecols=crime_cols)
    
    # Rename columns to match expected format if needed, but standard Chicago data is usually capitalized
    # We'll standardize to what we need
    df_crime = df_crime.rename(columns={
        'Latitude': 'latitude', 
        'Longitude': 'longitude',
        'Primary Type': 'Primary Type'
    })
    
    # Drop NaNs in coordinates
    df_crime = df_crime.dropna(subset=['latitude', 'longitude'])

    # 3. Filter Data
    print("Filtering data...")
    SELECTED_CRIMES = ['HOMICIDE', 'BATTERY', 'ASSAULT', 'ROBBERY', 'BURGLARY']
    df_crime_filtered = df_crime[df_crime['Primary Type'].isin(SELECTED_CRIMES)].copy()

    # Convert Date
    df_crime_filtered['Date'] = pd.to_datetime(df_crime_filtered['Date'])
    
    # Create time periods (Quarterly)
    df_crime_filtered['period'] = df_crime_filtered['Date'].dt.to_period('Q').astype(str)
    periods = sorted(df_crime_filtered['period'].unique())

    # 4. Structure Data for D3
    print("Structuring data...")
    
    # Prepare Airbnb data (static for now, or could be temporal if we had date data)
    # We'll just take the current listings
    airbnb_data = {
        "count": len(df_listings),
        "locations": df_listings[['latitude', 'longitude', 'price', 'room_type', 'neighbourhood']].rename(
            columns={'latitude': 'lat', 'longitude': 'lon', 'neighbourhood': 'neighborhood'}
        ).fillna(0).to_dict('records')
    }

    output_data = {
        "periods": periods,
        "crime_types": SELECTED_CRIMES,
        "airbnb": airbnb_data,
        "crimes": []
    }

    # 5. Process each period
    MAX_CRIMES_PER_PERIOD = 2000 # Limit points for browser performance

    for period in periods:
        period_data = df_crime_filtered[df_crime_filtered['period'] == period]
        
        # Sample if too many
        if len(period_data) > MAX_CRIMES_PER_PERIOD:
            period_data = period_data.sample(n=MAX_CRIMES_PER_PERIOD, random_state=42)
        
        output_data["crimes"].append({
            "period": period,
            "count": int(len(period_data)),
            "locations": period_data[['latitude', 'longitude', 'Primary Type']].rename(
                columns={'latitude': 'lat', 'longitude': 'lon', 'Primary Type': 'type'}
            ).to_dict('records')
        })

    # 6. Export
    print(f"Exporting to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(output_data, f)

    print(f"Done! Exported {len(periods)} periods of data.")

if __name__ == "__main__":
    generate_data()
