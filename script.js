google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(drawDashboard);
google.charts.setOnLoadCallback(loadData);
google.charts.setOnLoadCallback(drawScatterPlot);
let currentIndex = 0;
let currentYearIndex = 0;
function drawDashboard() {
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

      const year2020Data = [["Crops", "Area", "Production"]];
      const year2021Data = [["Crops", "Area", "Production"]];
      const year2022Data = [["Crops", "Area", "Production"]];

      rows.forEach((row) => {
        const columns = row.split(",");
        if (columns.length > 6) {
          year2020Data.push([columns[0], +columns[1], +columns[2]]);
          year2021Data.push([columns[0], +columns[3], +columns[4]]);
          year2022Data.push([columns[0], +columns[5], +columns[6]]);
        }
      });

      // Chart for 2020/21
      const chart2020 = google.visualization.arrayToDataTable(year2020Data);
      const options2020 = {
        title: "Pulses Area and Production (2020/21)",
        isStacked: true,
        legend: { position: "bottom" },
        vAxis: { title: "Crops" },
        hAxis: { title: "Area / Production" },
      };
      const chartDiv2020 = new google.visualization.BarChart(
        document.getElementById("chart_2020")
      );
      chartDiv2020.draw(chart2020, options2020);

      // Chart for 2021/22
      const chart2021 = google.visualization.arrayToDataTable(year2021Data);
      const options2021 = {
        title: "Pulses Area and Production (2021/22)",
        isStacked: true,
        legend: { position: "bottom" },
        vAxis: { title: "Crops" },
        hAxis: { title: "Area / Production" },
      };
      const chartDiv2021 = new google.visualization.BarChart(
        document.getElementById("chart_2021")
      );
      chartDiv2021.draw(chart2021, options2021);

      // Chart for 2022/23
      const chart2022 = google.visualization.arrayToDataTable(year2022Data);
      const options2022 = {
        title: "Pulses Area and Production (2022/23)",
        isStacked: true,
        legend: { position: "bottom" },
        vAxis: { title: "Crops" },
        hAxis: { title: "Area / Production" },
      };
      const chartDiv2022 = new google.visualization.BarChart(
        document.getElementById("chart_2022")
      );
      chartDiv2022.draw(chart2022, options2022);
    });

  // Land Use Chart
  fetch("Processed Data(Land Use Distribution By Use).csv")
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split("\n").slice(1);
      const landUseData = [
        [
          "",
          "Bagmati",
          "Gandaki",
          "Karnali",
          "Koshi",
          "Lumbini",
          "Madhesh",
          "Sudurpashchim",
        ],
      ];
      rows.forEach((row) => {
        const columns = row.split(",");
        if (columns.length > 7) {
          landUseData.push([
            columns[0],
            +columns[1],
            +columns[2],
            +columns[3],
            +columns[4],
            +columns[5],
            +columns[6],
            +columns[7],
          ]);
        }
      });

      const landUseChart = google.visualization.arrayToDataTable(landUseData);
      const landUseOptions = {
        title: "Land Use Distribution by Province",
        hAxis: { title: "Type" },
        vAxis: { title: "Area (sq km)" },
      };
      const chart = new google.visualization.ColumnChart(
        document.getElementById("land_use_chart")
      );
      chart.draw(landUseChart, landUseOptions);
    });
  /*for stacked column chart*/
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
        chartArea: { width: "60%" },
        isStacked: true,
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

  fetch("Processed Data(Cereal).csv")
    .then((response) => response.text())
    .then((data) => {
      const rows = data
        .split("\n")
        .map((row) => row.trim())
        .slice(1); // Skip header
      const chartData = [["Cereal", "Area", "Production", "Year"]];

      // Separate arrays for each year
      const yearData = [2077, 2078, 2079].map(() => []);

      rows.forEach((row) => {
        const cols = row.split(",").map((col) => col.trim());
        if (cols.length >= 7) {
          yearData[0].push([
            cols[0],
            parseInt(cols[1], 10) || 0,
            parseInt(cols[2], 10) || 0,
            2077,
          ]);
          yearData[1].push([
            cols[0],
            parseInt(cols[3], 10) || 0,
            parseInt(cols[4], 10) || 0,
            2078,
          ]);
          yearData[2].push([
            cols[0],
            parseInt(cols[5], 10) || 0,
            parseInt(cols[6], 10) || 0,
            2079,
          ]);
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
          title: "Cereal Area(Ha.) by Type",
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
          title: "Cereal Production(Mt.) by Type",
          width: 400,
          height: 300,
          legend: { position: "right" },
        },
        view: { columns: [0, 2] }, // Cereal, Production
      });

      function updateChartsForYear() {
        const dataTable = google.visualization.arrayToDataTable([
          ["Cereal", "Area", "Production", "Year"],
          ...yearData[currentYearIndex],
        ]);
        dashboard.draw(dataTable);
      }

      // Bind the production slider to the charts
      dashboard.bind(productionSlider, [areaChart, productionChart]);

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
                    // Bar chart for district
                    const { sheepsNo, woolProduced } = provinceDistrictData[selectedProvince][selectedDistrict];
                    const chartData = google.visualization.arrayToDataTable([
                        ['Metric', 'Value'],
                        ['Sheeps No.', sheepsNo],
                        ['Wool Produced', woolProduced]
                    ]);

                    const options = {
                        title: `${selectedDistrict} - Sheep and Wool Data`,
                        vAxis: { title: 'Value' },
                        hAxis: { title: 'Metric' },
                        bars: 'group'
                    };

                    const chart = new google.visualization.BarChart(chartDiv);
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
                        vAxis: { title: 'Sheep Wool Produced' },
                    };

                    const chart = new google.visualization.ScatterChart(chartDiv);
                    chart.draw(data, options);
                }
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}
