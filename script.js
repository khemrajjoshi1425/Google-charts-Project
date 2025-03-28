google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(drawDashboard);
google.charts.setOnLoadCallback(loadData);
google.charts.setOnLoadCallback(drawScatterPlot);
google.charts.setOnLoadCallback(loadCSV);
google.charts.setOnLoadCallback(drawBubbleRaceChart);
let chart; 
let areaChart; 
let dataTable; 
let currentYearIndex = 0; 
let currentIndex = 0;
function drawDashboard() {
  fetch("Tomato Big(Nepali).csv").then((response) => response.text()).then((data) => {
    const row = data.split("\n").slice(1);
    const tomatoData = [["Date", "Avg"]];
    row.forEach((row) => {
      const columns = row.split(",");
      if (columns.length > 1) {
        tomatoData.push([
          columns[0],
          +columns[1],
        ]);
      }
    });
    const tomatoChart = google.visualization.arrayToDataTable(tomatoData);
    const tomatoOptions = {
      title: "Tomato Big (Nepali) Price Trends",
      hAxis: { title: "Date" },
      vAxis: { title: "Average Price (Rs.)" },
    };
    const chart = new google.visualization.LineChart(document.getElementById("tomato"));
    chart.draw(tomatoChart, tomatoOptions);
  })
  fetch("Seed Balance Sheet.csv")
    .then((response) => response.text())
    .then((data) => {
      const csvData = data.split("\n").slice(2);
      console.log(csvData);
      const seedData = [["Crops", "FY 2074/75 Total seed require-", "FY 2074/75 Total seed supply in", "FY 2075/76 Total seed require-", "FY 2075/76 Total seed supply in", "FY 2076/77 Total seed require-", "FY 2076/77 Total seed supply in", "FY 2077/78 Total seed require-", "FY 2077/78 Total seed supply in", "FY 2078/79 Total seed require-", "FY 2078/79 Total seed supply in"],]
      csvData.forEach((row) => {
        const columns = row.split(",");
        if (columns.length > 10) {
          seedData.push([
            columns[0],
            +columns[1],
            +columns[2],
            +columns[4],
            +columns[5],
            +columns[7],
            +columns[8],
            +columns[10],
            +columns[11],
            +columns[13],
            +columns[14],
          ]);
        }
      });
      console.log(seedData);
      // Get the container for the charts
      var container = document.querySelector('.seed_balance_sheet_chart_container');

      // Loop through the data and generate a chart for each crop
      for (var i = 1; i < seedData.length; i++) {
        var crop = seedData[i][0];
        var data = new google.visualization.DataTable();

        // Add columns: Year, Total Seed Require, Total Seed Supply
        data.addColumn('string', 'Year');
        data.addColumn('number', 'Total Seed Requirement');
        data.addColumn('number', 'Total Seed Supply');

        // Add rows dynamically for each crop
        data.addRows([
          ['FY 2074/75', seedData[i][1], seedData[i][2]],
          ['FY 2075/76', seedData[i][3], seedData[i][4]],
          ['FY 2076/77', seedData[i][5], seedData[i][6]],
          ['FY 2077/78', seedData[i][7], seedData[i][8]],
          ['FY 2078/79', seedData[i][9], seedData[i][10]]
        ]);

        var options = {
          title: crop + ' Seed Data',
          legend: { position: 'bottom' },
          hAxis: { title: 'Year' },
          vAxis: { title: 'Total Seed Requirement / Total Seed Supply (in Metric Tone)' }
        };

        // Dynamically create a div for each crop chart inside the container
        var chartDiv = document.createElement('div');
        chartDiv.id = 'chart_' + crop;
        chartDiv.style = 'width: 600px; height: 400px;';

        container.appendChild(chartDiv);

        // Create and draw the chart
        var chart = new google.visualization.LineChart(document.getElementById('chart_' + crop));
        chart.draw(data, options);
      }
    });
  // Livestock Chart
  fetch("Processed Data(Livestock).csv")
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split("\n").slice(1);
      const livestockData = [["Category", "2020/21", "2021/22", "2022/23"]];
      rows.forEach((row) => {
        const columns = row.split(",");
        if (columns.length > 3) {
          livestockData.push([
            columns[0],
            +columns[1],
            +columns[2],
            +columns[3],
          ]);
        }
      });

      const livestockChart =
        google.visualization.arrayToDataTable(livestockData);
      const livestockOptions = {
        title: "Livestock Population Trends",
        hAxis: { title: "Category" },
        vAxis: { title: "Population" },
      };
      const chart = new google.visualization.ColumnChart(
        document.getElementById("livestock_chart")
      );
      chart.draw(livestockChart, livestockOptions);
    });

// Pulses Chart
fetch("Processed Data(Pulses).csv")
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n").slice(2);

    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    let cropColors = {};
    let colorIndex = 0;

    const processYearData = (areaHeader, productionHeader, areaIndex, productionIndex) => {
      let areaData = [["Crops", "Area", { role: "style" }]];
      let productionData = [["Crops", "Production", { role: "style" }]];
      
      rows.forEach((row) => {
        const columns = row.split(",");
        if (columns.length > 6) {
          const crop = columns[0];
          if (!cropColors[crop]) {
            cropColors[crop] = colors[colorIndex % colors.length];
            colorIndex++;
          }
          const cropColor = cropColors[crop];
          
          areaData.push([crop, +columns[areaIndex], cropColor]);
          productionData.push([crop, +columns[productionIndex], cropColor]);
        }
      });

      areaData = [areaData[0], ...areaData.slice(1).sort((a, b) => b[1] - a[1])];
      productionData = [productionData[0], ...productionData.slice(1).sort((a, b) => b[1] - a[1])];
      
      return { areaData, productionData };
    };

    const year2020 = processYearData("Pulses Area (2020/21)", "Pulses Production (2020/21)", 1, 2);
    const year2021 = processYearData("Pulses Area (2021/22)", "Pulses Production (2021/22)", 3, 4);
    const year2022 = processYearData("Pulses Area (2022/23)", "Pulses Production (2022/23)", 5, 6);

    const drawChart = (data, title, divId, vAxisTitle) => {
      const chart = google.visualization.arrayToDataTable(data);
      const options = {
        title: title,
        hAxis: { title: "Crops Type" },
        vAxis: { title: vAxisTitle },
        legend: { position: "none" },
        bars: "vertical", 
      };
      const chartDiv = new google.visualization.ColumnChart(
        document.getElementById(divId)
      );
      chartDiv.draw(chart, options);
    };

    // Initial chart drawing for default year (2020)
    drawChart(year2020.areaData, "Pulses Area (2020/21)", "chart-area", "Area in Hectare");
    drawChart(year2020.productionData, "Pulses Production (2020/21)", "chart-production", "Production in Metric Tonnes");

    // Year switch logic
    document.getElementById("year_switch").addEventListener("change", (event) => {
      const year = event.target.value;
      switch (year) {
        case "2020":
          drawChart(year2020.areaData, "Pulses Area (2020/21)", "chart-area", "Area in Hectare");
          drawChart(year2020.productionData, "Pulses Production (2020/21)", "chart-production", "Production in Metric Tonnes");
          break;
        case "2021":
          drawChart(year2021.areaData, "Pulses Area (2021/22)", "chart-area", "Area in Hectare");
          drawChart(year2021.productionData, "Pulses Production (2021/22)", "chart-production", "Production in Metric Tonnes");
          break;
        case "2022":
          drawChart(year2022.areaData, "Pulses Area (2022/23)", "chart-area", "Area in Hectare");
          drawChart(year2022.productionData, "Pulses Production (2022/23)", "chart-production", "Production in Metric Tonnes");
          break;
      }
    });
  });

  // Land Use Chart
  fetch("Processed Data(Land Use Distribution By Use).csv")
    .then((response) => response.text())
    .then((data) => {
        const rows = data.split("\n").map(row => row.split(","));
        
        // Extract land use categories (skip empty headers in CSV)
        const categories = rows.slice(2).map(row => row[0]); 
        
        // Extract provinces (column headers from the second row)
        const provinces = rows[1].slice(0); 
        
        // Prepare data for Google Charts
        const landUseData = [["Province", ...categories]]; 

        // Loop through each province (columns from CSV)
        for (let i = 1; i < provinces.length; i++) {
            let provinceName = provinces[i];
            let provinceData = [provinceName];

            // Collect data for each land use category
            for (let j = 2; j < rows.length; j++) {
                provinceData.push(parseFloat(rows[j][i]) || 0);
            }

            landUseData.push(provinceData);
        }

        const chartData = google.visualization.arrayToDataTable(landUseData);

        const options = {
            title: "Land Use Distribution by Province",
            hAxis: { title: "Provinces" },
            vAxis: { title: "Area (sq km)" },
            bars: "group", // Ensures a grouped bar chart
            isStacked: false, // Keep bars separate
        };

        const chart = new google.visualization.ColumnChart(
            document.getElementById("land_use_chart")
        );
        chart.draw(chartData, options);
    });


  /*for grouped bar chart*/
  fetch("chemical fertilizer sales.csv")
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split("\n").slice(1);
      const chartData = [
        [
          "Province",
          "AICL Urea",
          "AICL DAP",
          "AICL Potash",
          "STCL Urea",
          "STCL DAP",
          "STCL Potash",
        ],
      ];

      rows.forEach((row) => {
        if (row.trim() !== "") {
          const cols = row.split(",");
          chartData.push([
            cols[0], // Province
            parseInt(cols[1]), // AICL Urea
            parseInt(cols[2]), // AICL DAP
            parseInt(cols[3]), // AICL Potash
            parseInt(cols[4]), // STCL Urea
            parseInt(cols[5]), // STCL DAP
            parseInt(cols[6]), // STCL Potash
          ]);
        }
      });

      const data = google.visualization.arrayToDataTable(chartData);

      const options = {
        title: "Fertilizer Distribution by Province",
        chartArea: { width: "50%" },
        isStacked: false,
        hAxis: {
          title: "Provinces",
        },
        vAxis: {
          title: "Quantity",
        },
        colors: [
          "#3366cc",
          "#dc3912",
          "#ff9900",
          "#109618",
          "#990099",
          "#0099c6",
        ],
      };

      const chart = new google.visualization.ColumnChart(
        document.getElementById("column-chart")
      );
      chart.draw(data, options);
    });
  // for pie charts
  fetch("Processed Data(Cereal).csv")
  .then((response) => response.text())
  .then((data) => {
    const rows = data
      .split("\n")
      .map((row) => row.trim())
      .slice(2); // Skip header
    const chartData = [["Cereal", "Area", "Production", "Yield", "Year"]];

    // Separate arrays for each year
    const yearData = [2077, 2078, 2079].map(() => []);

    rows.forEach((row) => {
      const cols = row.split(",").map((col) => col.trim());
      if (cols.length >= 7) {
        const area2020 = parseInt(cols[1], 10) || 0;
        const production2020 = parseInt(cols[2], 10) || 0;
        const yield2020 = area2020 > 0 ? production2020 / area2020 : 0;

        const area2021 = parseInt(cols[3], 10) || 0;
        const production2021 = parseInt(cols[4], 10) || 0;
        const yield2021 = area2021 > 0 ? production2021 / area2021 : 0;

        const area2022 = parseInt(cols[5], 10) || 0;
        const production2022 = parseInt(cols[6], 10) || 0;
        const yield2022 = area2022 > 0 ? production2022 / area2022 : 0;

        yearData[0].push([cols[0], area2020, production2020, yield2020, 2077]);
        yearData[1].push([cols[0], area2021, production2021, yield2021, 2078]);
        yearData[2].push([cols[0], area2022, production2022, yield2022, 2079]);
      }
    });

    const dashboard = new google.visualization.Dashboard(
      document.getElementById("pie-charts")
    );

    // Slider for Production
    const productionSlider = new google.visualization.ControlWrapper({
      controlType: "NumberRangeFilter",
      containerId: "production_slider_div",
      options: {
        filterColumnIndex: 2, // Production column
        ui: { label: "Filter by Value" },
      },
    });

    // Pie Chart for Area
    const areaChart = new google.visualization.ChartWrapper({
      chartType: "PieChart",
      containerId: "area_chart_div",
      options: {
        width: 400,
        height: 300,
        legend: { position: "right" },
      },
      view: { columns: [0, 1] }, // Cereal, Area
    });

    // Pie Chart for Production
    const productionChart = new google.visualization.ChartWrapper({
      chartType: "PieChart",
      containerId: "production_chart_div",
      options: {
        width: 400,
        height: 300,
        legend: { position: "right" },
      },
      view: { columns: [0, 2] }, // Cereal, Production
    });

    // Pie Chart for Yield
    const yieldChart = new google.visualization.ChartWrapper({
      chartType: "PieChart",
      containerId: "yield_chart_div",
      options: {
        width: 400,
        height: 300,
        legend: { position: "right" },
      },
      view: { columns: [0, 3] }, // Cereal, Yield
    });

    function updateChartsForYear() {
      const dataTable = google.visualization.arrayToDataTable([
        ["Cereal", "Area", "Production", "Yield", "Year"],
        ...yearData[currentYearIndex],
      ]);
      dashboard.draw(dataTable);

      // Update chart titles based on the year
      areaChart.setOption("title", `Cereal Area (Ha.) by Type (${yearData[currentYearIndex][0][4]})`);
      productionChart.setOption("title", `Cereal Production (Mt.) by Type (${yearData[currentYearIndex][0][4]})`);
      yieldChart.setOption("title", `Cereal Yield (Mt./Ha.) by Type (${yearData[currentYearIndex][0][4]})`);
    }

    // Bind the production slider to the charts
    dashboard.bind(productionSlider, [areaChart, productionChart, yieldChart]);

    // Initial draw for the first year
    updateChartsForYear();

    // Next Year Button
    document.getElementById("next_year_btn").addEventListener("click", () => {
      currentYearIndex = (currentYearIndex + 1) % yearData.length;
      updateChartsForYear();
    });
  })
  .catch((error) =>
    console.error("Error fetching or processing data:", error)
  );
}
/*for combo chart*/
function loadData() {
  fetch("fresh veg stat.csv")
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split("\n").slice(2);
      const chartData = [
        ["Province", "Area (Ha.)", "Production (Mt.)", "Yield (Mt./Ha)"],
      ];

      rows.forEach((row) => {
        if (row.trim() !== "") {
          const cols = row
            .split(",")
            .map((col) => col.replace(/"/g, "").trim()); // Remove quotes and spaces
          if (cols[0] !== "TOTAL") {
            // Ignore total row
            chartData.push([
              cols[0], // Province
              parseInt(cols[1].replace(/,/g, "")), // Area (Ha.)
              parseInt(cols[2].replace(/,/g, "")), // Production (Mt.)
              parseFloat(cols[3]), // Yield (Mt./Ha)
            ]);
          }
        }
      });

      drawChart(chartData);
    })
    .catch((error) => console.error("Error loading CSV:", error));
}

function drawChart(chartData) {
  const selectedData = [
    ["Province", "Area (Ha.)", "Production (Mt.)", "Yield (Mt./Ha)"],
  ];
  selectedData.push(chartData[currentIndex + 1]); // Skip header row

  const data = google.visualization.arrayToDataTable(selectedData);

  const options = {
    title: `Fresh Vegetables Statistics - ${chartData[currentIndex + 1][0]}`,
    chartArea: { width: "60%" },
    hAxis: { title: "Province" },
    vAxes: {
      0: { title: "Area (Ha.) & Production (Mt.)", format: "short" },
      1: { title: "Yield (Mt./Ha)", format: "decimal" },
    },
    seriesType: "bars",
    series: { 2: { type: "line", targetAxisIndex: 1 } }, // Yield as line chart
    colors: ["#3366cc", "#dc3912", "#ff9900"],
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
    legend: { position: "bottom" },
  };

  const chart = new google.visualization.ComboChart(
    document.getElementById("combo-chart")
  );
  chart.draw(data, options);
}

function nextProvince() {
  fetch("fresh veg stat.csv")
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split("\n").slice(1); // Skip header row
      const chartData = [
        ["Province", "Area (Ha.)", "Production (Mt.)", "Yield (Mt./Ha)"],
      ];

      rows.forEach((row) => {
        if (row.trim() !== "") {
          const cols = row
            .split(",")
            .map((col) => col.replace(/"/g, "").trim());
          if (cols[0] !== "TOTAL") {
            chartData.push([
              cols[0],
              parseInt(cols[1].replace(/,/g, "")),
              parseInt(cols[2].replace(/,/g, "")),
              parseFloat(cols[3]),
            ]);
          }
        }
      });

      currentIndex = (currentIndex + 1) % (chartData.length - 1);
      drawChart(chartData);
    });
}
/* For Scatter and Bar Charts */
function drawScatterPlot() {
  fetch('sheep_wool_production.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1);
        const provinceDistrictData = {};

        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length >= 4) {
                const province = columns[0].trim();
                const district = columns[1].trim();
                const sheepsNo = parseInt(columns[2].trim()) || 0;
                const woolProduced = parseInt(columns[3].trim()) || 0;

                if (!provinceDistrictData[province]) {
                    provinceDistrictData[province] = {};
                }
                provinceDistrictData[province][district] = { sheepsNo, woolProduced };
            }
        });

        const provinceSelect = document.getElementById('province');
        Object.keys(provinceDistrictData).forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.text = province;
            provinceSelect.appendChild(option);
        });

        const districtSelect = document.getElementById('district');

        provinceSelect.addEventListener('change', function() {
            updateDistrictDropdown();
            drawChart(); // Update the chart when province changes
        });

        districtSelect.addEventListener('change', drawChart);

        // Set a default province (e.g., "BAGMATI")
        const defaultProvince = "BAGMATI";
        provinceSelect.value = defaultProvince;
        updateDistrictDropdown(); // Populate districts for the default province
        drawChart(); // Draw initial chart

        function updateDistrictDropdown() {
            const selectedProvince = provinceSelect.value;
            districtSelect.innerHTML = '<option value="">Select District</option>';

            if (provinceDistrictData[selectedProvince]) {
                Object.keys(provinceDistrictData[selectedProvince]).forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.text = district;
                    districtSelect.appendChild(option);
                });
            }
        }

        function drawChart() {
            const selectedProvince = provinceSelect.value;
            const selectedDistrict = document.getElementById('district').value;
            const chartDiv = document.getElementById('scatter_plot');

            if (selectedDistrict) {
                // Bubble chart for district
                const { sheepsNo, woolProduced } = provinceDistrictData[selectedProvince][selectedDistrict];
                const chartData = google.visualization.arrayToDataTable([
                    ['Metric', 'Wool Produced', 'Sheeps No.'],
                    ['Wool Produced', woolProduced, sheepsNo]
                ]);

                const options = {
                    title: `${selectedDistrict} - Sheep and Wool Data`,
                    hAxis: { title: 'Wool Produced(in Kg)' },
                    vAxis: { title: 'Sheeps No.' },
                    sizeAxis: { minSize: 5, maxSize: 20 }, // Control bubble size based on sheep number
                };

                const chart = new google.visualization.BubbleChart(chartDiv);
                chart.draw(chartData, options);

            } else {
                // Scatter plot for province
                const chartData = [['Sheeps No.', 'Sheep Wool Produced']];
                Object.keys(provinceDistrictData[selectedProvince]).forEach(district => {
                    const { sheepsNo, woolProduced } = provinceDistrictData[selectedProvince][district];
                    chartData.push([sheepsNo, woolProduced]);
                });

                const data = google.visualization.arrayToDataTable(chartData);

                const options = {
                    title: `${selectedProvince} - Sheep Numbers vs. Wool Production`,
                    hAxis: { title: 'Sheeps No.' },
                    vAxis: { title: 'Wool Produced(in Kg)' },
                };

                const chart = new google.visualization.ScatterChart(chartDiv);
                chart.draw(data, options);
            }
        }
    })
    .catch(error => console.error('Error fetching CSV:', error));
}

//for Gdp Growth
function loadCSV() {
  // Load the CSV file using PapaParse
  Papa.parse("Annual GDP growth rate.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      processData(results.data);
    },
  });
}

function processData(csvData) {
  // Extract headers (years) and rows (economic activities)
  const headers = Object.keys(csvData[0]); // All headers (Industrial Classification + years)
  const years = headers.slice(1); // Extract years (skip the first column)

  // Prepare data for Google Charts
  const fullDataTable = [["Year", ...csvData.map((row) => row[headers[0]])]]; // First row: Year + Economic Activities

  // Add data for each year
  years.forEach((year) => {
    const rowData = [year];
    csvData.forEach((activity) => {
      rowData.push(activity[year]);
    });
    fullDataTable.push(rowData);
  });

  // Convert to Google Charts DataTable
  dataTable = google.visualization.arrayToDataTable(fullDataTable);

  // Initialize the charts
  initializeCharts();

  // Start year-by-year animation
  animateYearByYear();
}

function initializeCharts() {
  const options = {
    title: "Annual GDP Growth Rate by Economic Activities",
    curveType: "function",
    legend: { position: "right", textStyle: { fontSize: 12 } }, // Legend on the right with adjusted font size
    hAxis: { title: "Year" },
    vAxis: { title: "Growth Rate (%)" },
    chartArea: { width: "70%", height: "80%" }, // Adjust chart area to make space for the legend
  };


  // Initialize Area Chart
  areaChart = new google.visualization.AreaChart(
    document.getElementById("area_chart")
  );
}

function animateYearByYear() {
  if (currentYearIndex >= dataTable.getNumberOfRows()) {
    currentYearIndex = 0; // Reset to the first year after reaching the end
  }

  // Create a view of the data up to the current year
  const view = new google.visualization.DataView(dataTable);
  view.setRows(0, currentYearIndex + 1); // Show data up to the current year

  // Draw the Area Chart with the current view
  areaChart.draw(view, {
    title: `Annual GDP Growth Rate by Economic Activities (Up to ${dataTable.getValue(currentYearIndex, 0)})`,
    curveType: "function",
    legend: { position: "right", textStyle: { fontSize: 12 } }, // Legend on the right
    hAxis: { title: "Year" },
    vAxis: { title: "Growth Rate (%)" },
    isStacked: false,
    chartArea: { width: "70%", height: "80%" }, // Adjust chart area to make space for the legend
  });

  // Move to the next year
  currentYearIndex++;

  // Schedule the next frame of the animation
  setTimeout(animateYearByYear, 2000); // Adjust the delay (in milliseconds) as needed
}

//for commercial loans bubble race chart
function drawBubbleRaceChart() {
  fetch("commercial banks loan.csv") 
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split("\n").slice(1); // Skip the header row
      const sectors = [];
      const years = [];
      const data = [];

      // Extract years from the header
      const headers = csvData.split("\n")[0].split(",");
      years.push(...headers.slice(1).map((year) => parseInt(year))); // Extract years as numbers

      // Process each row (sector)
      rows.forEach((row) => {
        const columns = row.split(",");
        const sector = columns[0].replace(/"/g, ""); // Sector name (remove quotes)
        sectors.push(sector);

        // Extract loan values for each year
        const loanValues = columns.slice(1).map((value) => parseFloat(value));
        data.push(loanValues);
      });

      // Prepare data for Google Charts
      const chartData = [["Sector", "Year", "Loan Amount", "Size"]]; // Correct column order

      // Loop through each year and sector to create the data table
      years.forEach((year, yearIndex) => {
        sectors.forEach((sector, sectorIndex) => {
          const loanAmount = data[sectorIndex][yearIndex];
          const bubbleSize = loanAmount * 0.05; // Adjust the multiplier as needed for bubble size
          chartData.push([sector, year, loanAmount, bubbleSize]);
        });
      });

      // Convert to Google Charts DataTable
      const dataTable = google.visualization.arrayToDataTable(chartData);

      // Set chart options
      const options = {
        title: "Sector-wise Loan and Advances of Commercial Banks ",
        hAxis: { title: "Year", format: "####" }, // Format years as numbers
        vAxis: { title: "Loan Amount " },
        bubble: { textStyle: { fontSize: 11 } },
        animation: {
          duration: 1000,
          easing: "out",
          startup: true,
        },
        colors: [
          "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6",
          "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99"
        ],
      };

      // Draw the chart initially with all years, but we'll animate it later
      const chart = new google.visualization.BubbleChart(document.getElementById("bubble_race_chart"));
      chart.draw(dataTable, options);

      // Function to animate the chart year by year
      let currentYearIndex = 0;
      const intervalTime = 2000; // 2 second between each year update

      function animateChart() {
        if (currentYearIndex > years.length - 1) {
          currentYearIndex = 0; // Reset to the first year after reaching the end
        }

        // Filter the rows for the current year and create a view of the data
        const view = new google.visualization.DataView(dataTable);
        const filteredRows = dataTable.getFilteredRows([{ column: 1, minValue: years[0], maxValue: years[currentYearIndex] }]);

        view.setRows(filteredRows);

        // Update the chart title to show the current year range
        options.title = `Sector-wise Loan and Advances of Commercial Banks (Up to ${years[currentYearIndex]})`;

        // Draw the chart with the updated view
        chart.draw(view, options);

        // Move to the next year
        currentYearIndex++;

        // Schedule the next frame of the animation
      }

      // Start the animation
      setInterval(animateChart, intervalTime); // Adjust the delay (in milliseconds) as needed
    })
    .catch((error) => console.error("Error loading CSV:", error));
}