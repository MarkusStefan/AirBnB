<span style="font-family: 'Courier New', monospace;">

<div align="center">

# Discover Report:<br> Chicago Airbnb Visual Data Science Project
*Markus Köfler | 24th October 2025*
</div>

## Project Purpose

This project aims to analyze prices and locations of Airbnbs using Airbnb data of Chicago, as well as other data sources about Chicago, mainly crime data. The goal is to understand how various factors, such as neighborhood characteristics and crime rates, influence Airbnb pricing and distribution across the city. By visualizing these relationships, I aim to provide insights for hosts, potential investors, city planners, and even guests regarding the dynamics of the short-term rental market in Chicago.

## Topic Description

Our central question asks how Chicago’s short-term rental market is shaped by (1) geographic placement within the city, and (2) neighborhood characteristics such as crime intensity, population distribution, and amenities. The analysis follows two complementary threads:

1. **Spatial footprint of listings** – mapping density, clustering, and proximity to civic features to highlight which districts attract hosts and visitors.
2. **Price structure** – measuring how local conditions translate into price premiums or discounts, laying the groundwork for predictive modeling.

These perspectives shall equip stakeholders with insights into urban tourism patterns - that would otherwise be difficult to extract and communicate without visual data science techniques.

## Selected Datasets
The analysis combines three complementary sources which can be joined based on spatial features:
- **Airbnb listings data** – Row-level observations of active rentals with nightly `price`, `room_type`, `accommodates`, `bedrooms`, review metrics, and precise `latitude`/`longitude`. These attributes let us explore price structure, supply intensity, and amenity mixes across neighborhoods.
- **Chicago crime data** – Incident-level records enriched with `primary_type`, `description`, timestamps, and geographic coordinates. Filtering homicide IUCR codes and aggregating incidents per tract provides a safety signal to relate to both listing density and pricing.
- **Chicago city and population geodata** – Boundary polygons for census tracts, block populations, park and boulevard outlines, and contextual descriptors such as `population`, `area`, and amenity coverage. This layer supplies the shared spatial index needed to align Airbnb and crime data while giving demographic baselines for normalization.


</span>