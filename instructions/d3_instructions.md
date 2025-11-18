Individual Assignment 3: D3 Implementation
This is an individual assignment. You cannot work in groups.
Now, you have learned the basics of D3.js to build your visualization tool. It is time to apply this knowledge to implement a visualization for each team member that you may reuse in your project.
Since this is an individual assignment within the team project, each student is responsible for implementing different visualizations. The team should engage in a conversation to allocate different visualizations to each team member. In this assignment, each student will submit their individual work (i.e., one visualization per person), and the chosen visualization type (bar chart, area chart, heatmap, etc.) must be different from that of other students in the same team.
What to do
Based on your dataset and sketch from past assignments, the first thing to do is identify the main visualization for your project to implement. Then, try to extract the elements in your selected visualization, including:
-	What are data variables?
-	What type of visualization is it?
-	What visual encodings does it use?
-	What are the visual elements, i.e., marks, scale, channel, color, etc.?
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
You are encouraged to try out different layouts of the data (area, radial, etc.). Looking at the D3 Gallery (https://observablehq.com/@d3/gallery) in Observable for examples with source code.
You may adapt demos or example implementations from the internet or use generative AI tools (such as ChatGPT) to help you implement visualization. However, you must properly reference all original sources that you adapt and clearly document any use of generative AI, including how it was applied (e.g., code generation, debugging, or design suggestions).
Hosting and Deployment
Please host your implementation as github/gitlab project and deploy your implementation as webpage to be accessable for grading and for the submission talks. You can use https://gitlab.tuwien.ac.at or https://github.com/ for hosting and deploying your implementation. Please share the links to the project and the running implementation in the comment when uploading your file. See this file for updates on instructions for hosting and deployment. 
What to Submit
Please submit the url to the hosted source code, the link to the webpage running the implementation in the comment of the submission as well as the project folder in a zip file containing the following components:
1.	Source code: Your source code should include HTML, CSS, and JavaScript files. The "index.html" file should act as the initial page and incorporate your visualization.
2.	Dataset: Include your dataset in the submitted folder or load it from an accessible URL or dstAPI link. This will enable us to run your visualization directly on our computer.
3.	Screenshot: Include a screenshot of your visualization in the folder (in .jpg or .png format). We will check whether the source code we run provides the same result as the screenshot.
