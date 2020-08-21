function init() {
    var dropDown = d3.select('#selDataset')
    d3.json('samples.json').then((data) => {
        //console.log(data)


        // Create Dropdown list
        data.names.forEach(function(name) {
            dropDown.append('option').text(name).property('value')
        })

        //Create a value to use as an ID when the page first loads
        var initName = data.names[0]
        
        makeCharts(initName)
    })
}


function makeCharts(id) {
    d3.json('samples.json').then((data) => {

        // make horizontal bar chart

        //Creating variables to store information from the JSON

        var samples = data.samples.filter((sample) => sample.id == id)[0]

        var sample_vals = samples.sample_values

        // Sorting the values in descending order
        var sort_sample_vals = sample_vals.sort((a,b) => b-a)

        // Getting the first 10 samples
        var sliced_sample_vals = sort_sample_vals.slice(0,10)

        // Getting y values
        var otuIds = samples.otu_ids.slice(0,10).reverse()

        // Creating labels
        var otu_ids_clean = otuIds.map((d)=> 'OTU ' + d)


        // Making the trace for the horizontal bar chart
        var hbar_trace = {
            x: sliced_sample_vals.reverse(),
            y: otu_ids_clean,
            type: 'bar',
            orientation: 'h',
            text: samples.otu_labels.slice(0,10)
        }

        hbar_trace_data = [hbar_trace]

        // Plotting
        Plotly.newPlot('bar', hbar_trace_data)


        // make bubble chart

        var bubble_trace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: 'markers',
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: 'Portland'
            },
            text: samples.otu_labels
        }

        var bubble_data = [bubble_trace]

        var bubble_layout = {
            xaxis: {
                title: 'OTU ID'
            }
        }

        Plotly.newPlot('bubble', bubble_data, bubble_layout)

        // Guage Chart

        var washFreq = data.metadata.filter((meta) => meta.id == id)[0].wfreq

        var dataG = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "Belly Button Washing Frequency"},
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9] },
                bar: {color: 'cyan'}
              }
            }
          ];
          
          var layoutG = { 
              width: 600, 
              height: 450, 
              margin: { t: 0, b: 0 }
            };
          
          
        Plotly.newPlot('gauge', dataG, layoutG);

        // Demographic Info Panel


        // Selecting the div to append the values to
        var metaDisplay = d3.select('#sample-metadata')

        // Clearing any information before adding new information
        metaDisplay.html('')

        // filtering data based on the ID chosen
        var metaData = data.metadata.filter((meta)=> meta.id == id)[0]

        // Appending the info using HTML
        metaDisplay.append('p').html(
            `<p>Id: ${metaData.id}</p>
            <p>Ethnicity: ${metaData.ethnicity}</p>
            <p>Gender: ${metaData.gender}</p>
            <p>Age: ${metaData.age}</p>
            <p>Location: ${metaData.location}</p>
            <p>bbtype: ${metaData.bbtype}</p>
            <p>wfreq: ${metaData.wfreq}</p>`
        )


    })
}

// Creating function to use when the option has changed
function optionChanged(id){
    makeCharts(id)
}

// running the inital function
init()
