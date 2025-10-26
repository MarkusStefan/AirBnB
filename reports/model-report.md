<span style="font-family: 'Ctheier New', monospace;">

<div align="center">

# Wrangle & Profile Report:<br> Chicago Airbnb Visual Data Science Project
*Markus Köfler | 26th October 2025*
</div>

## Model Stage

### Modeling Approach

To understand the factors that determine Airbnb prices, I trained several supervised machine learning models. The Random Forest model proved to be the most effective predictor. A key finding was that model performance consistently improved as I included more features, increasing from 10 to 20 predictors. This suggests that Airbnb pricing is complex and influenced by a wide array of factors. Interestingly, some expected features, like the number of people a unit accommodates, were less important than anticipated. The visualization below plots the actual prices against the prices predicted by the best-performing model. While not perfect, the model captures the general trend, confirming that factors beyond simple location, such as amenities and property characteristics, are significant in determining price.

<br>
<div align="center">
<img src="https://i.imgur.com/Qk7hC1O.png" alt="Scatter plot of actual vs. predicted Airbnb prices from the Random Forest model" width="700"/>
*Actual vs. Predicted prices for the Random Forest model with 20 features. The points cluster around the diagonal line, indicating the model's predictive power.*
</div>
<br>


### Increase Trust through Visualization

To enhance the model's credibility and facilitate stakeholder understanding, I employed various visualization techniques. These visualizations served multiple purposes:

1. **Model Performance Visualization**: I created plots to illustrate the model's performance metrics, such as RMSE and R-squared values, across different feature sets. This helped stakeholders grasp the impact of feature selection on model accuracy.

2. **Feature Importance Visualization**: By visualizing feature importance scores from the Random Forest model, I highlighted the most influential factors driving Airbnb prices. This transparency fosters trust in the model's predictions and aids in identifying potential areas for further investigation.

3. **Prediction Distribution Visualization**: I plotted the distribution of predicted prices against actual prices to identify any systematic biases in the model. This visualization revealed areas where the model performed well and where it struggled, guiding future improvements.

4. **Geospatial Visualization**: Leveraging the geographic context of the data, I created maps to visualize predicted Airbnb prices across different neighborhoods. This spatial representation not only enhances interpretability but also allows stakeholders to see how local factors influence pricing.

By employing these visualization strategies, I aimed to build trust in the model's predictions and facilitate informed decision-making among stakeholders.

</span>