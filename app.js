
/*

HINT 1

 When importing json, try using metadata

//  d3.json("samples.json").then((data) => {
//     var metadata = data.metadata;
//     var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
//     var result = resultArray[0];

//     console.log(result);

//  });

HINT 2

 Event Listener is different in this html, review id="selDataset" in index.html
 <select id="selDataset" onchange="optionChanged(this.value)"></select>

*/

    function init() {
      // Grab a reference to the dropdown select element
      var selector = d3.select("#selDataset");

      // Use the list of sample names to populate the select options
      d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        console.log(sampleNames);

        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
 
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
    }

    // Initialize the dashboard
    init();


    function optionChanged(newSample) {
      // Fetch new data each time a new sample is selected
      buildMetadata(newSample);
      buildCharts(newSample);
      
    }

    // Demographics Panel 
    function buildMetadata(sample) {
      d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
      });
    }
    // Bar and Bubble charts
    // Create the buildCharts function.
    function buildCharts(sample) {
      // Use d3.json to load and retrieve the samples.json file 
      d3.json("samples.json").then((data) => {
        // Create a variable that holds the samples array. 
        var sampleInfo = data.samples;
            console.log(sampleInfo);
        // Create a variable that filters the samples for the object with the desired sample number.
        var selectedSample = sampleInfo.filter(sampleObj => sampleObj.id == sample)
        // Create a variable that holds the first sample in the array.
        var sampleOne = selectedSample[0];
            console.log(sampleOne);
        // Create variables that hold the otu_ids, otu_labels, and sample_values.
        var sampleValues = sampleOne.sample_values
        var otuLabels = sampleOne.otu_labels
        var otuIds = sampleOne.otu_ids
        
        // Hint: Get the the top 10 otu_ids and map them in descending order  
        // so the otu_ids with the most bacteria are last. 
        var sampleValuesBar = sampleValues.slice(0,10).reverse();
        var otuLabelsBar = otuLabels.slice(0,10).reverse();
        var otuIdsBar = otuIds.slice(0,10).reverse();

        // Create varibable for the washing frequency
        var metadata2 = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray2 = metadata2.filter(sampleObj => sampleObj.id == sample);
        var result2 = resultArray2[0];
        var washFreq = result2.wfreq;
            console.log(washFreq);
        // Create the yticks for the bar chart.
        var yticks = otuIdsBar.map(id => 'OTU '+ id);
            console.log(yticks);
      
            // Create the trace for the bar chart. 
        var trace1 = {
            x: sampleValuesBar,
            y: yticks,
            type: 'bar',
            orientation: 'h',
            text: otuLabelsBar
        }

        var barData = [trace1];
        // Create the layout for the bar chart. 
        var barLayout = {
              title: "Most Prevalent Bacterial Species"
        };
        // Use Plotly to plot the data with the layout. 
      
        // 1. Create the trace for the bubble chart.
        var trace2 = {
              x: otuIds,
              y: sampleValues,
              mode: 'markers',
            //   type: 'scatter',
              marker: {
                    size: sampleValues,
                    color: otuIds,
                    colorscale: 'Rainbow',
              },
              text: otuLabels
        }
        var bubbleData = [trace2];
        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
              xaxis: {
                    title: "OTU ID"
              }
          
        };
        // Create trace for gauge chart
        var trace3 = {
              domain: {x: [0,1], y: [0,1]},
              type: 'indicator',
              mode: 'gauge+number',
              value: washFreq,
              title: {
                    text: "Scrubs per Week",
                    font: {size: 14}
              },
              gauge: {
                  axis: {range: [null, 9]},
                  bar: {color: "#343409"},
                  steps: [
                    {range: [0, 1], color: '#F7F8F1'},
                    {range: [1, 2], color: '#EEF1E0'},
                    {range: [2, 3], color: '#F6FBD5'},
                    {range: [3, 4], color: '#EEF6C0'},
                    {range: [4, 5], color: '#DBEB75'},
                    {range: [5, 6], color: '#D3DF81'},
                    {range: [6, 7], color: '#B0BC5C'},
                    {range: [7, 8], color: '#9CA947'},
                    {range: [8, 9], color: '#869717'},
              ]}

        };

        var gaugeData = [trace3];
        // Create layout for gauge chart 
        var gaugeLayout = {
              title: "Belly Button Washing Frequency",
              
        };
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bar", barData, barLayout);
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
      });
    }

    init();


   