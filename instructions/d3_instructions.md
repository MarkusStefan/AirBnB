# D3 implementation
## What to Do
Based on your dataset and sketch from past assignments, the first thing to do is identify the main visualization for your project to implement. Then, try to extract the elements in your selected visualization, including:
●	What are data variables?
●	What type of visualization is it?
●	What visual encodings does it use?
●	What are the visual elements, i.e., marks, scale, channel, color, etc.?

After that, you can follow the steps in the D3 tutorial to implement the first layout of the data for your final project.
1.	Create a new project folder. You may use the template project from the tutorial to start your own project. If you are familiar with web development, feel free to adapt the HTML and CSS codes to create the aesthetic style of your web page.
2.	Load the dataset.
a.	In the data folder, replace the dataset in the tutorial with your own dataset.
b.	In the js/script.js file, try to load your dataset using d3.text, d3.csv, d3.tsv, d3.json, etc.
c.	Use console.log() to print out the dataset and convert all numeric and temporal variables into the proper data types.
3.	Create the visualization layout.
a.	Declare variables to define the width, height, and margins of the visualization. 
b.	Create an SVG element with the width and height variables.
4.	Add the main visualization elements.
a.	Create the scale to map the data range with the domain on the screen. Don’t forget to include the margin of the chart.
b.	Add visual marks to the chart with the correct scaled position.
c.	Add the x- and y-axis to the chart (if your chart needs the scale).
5.	Add animation and interaction.
a.	Add at least one animation and/or interactive feature to your visualization, such as transitions when the chart updates, hover tooltips, details-on-demand, brushing, or zooming.
b.	Check out the Animation and Interaction modules in the D3 documentation for guidance.
You may adapt demos or example implementations from the internet or use generative AI tools (such as ChatGPT) to help you implement visualization. However, you must properly reference all original sources that you adapt and clearly document any use of generative AI, including how it was applied (e.g., code generation, debugging, or design suggestions).


## Hosting and Deployment
You will host your project online and make it accessible for grading and the submission talk.
1.	Host your source code in a GitHub or TUWien GitLab repository.
a.	TUWien GitLab: https://gitlab.tuwien.ac.at 
b.	GitHub: https://github.com/ 
2.	Deploy your visualization as a publicly accessible webpage (e.g., GitHub Pages or GitLab Pages).
3.	When submitting the assignment, include (1) the link to the source code repository and (2) the link to live running webpage in the comment of the submission.
Please ensure both links are functional before submitting. You may find this deployment manual for TU Wien GitLab Pages helpful when setting up your project.
