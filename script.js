google.charts.load('current', { packages: ['corechart', 'controls'] });
google.charts.setOnLoadCallback(drawDashboard);
google.charts.setOnLoadCallback(loadData);
let currentIndex = 0;
let currentYearIndex = 0;
function drawDashboard() {
  // Livestock Chart
  fetch('Processed Data(Livestock).csv')
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split('\n').slice(1);
      const livestockData = [['Category', '2020/21', '2021/22', '2022/23']];
      rows.forEach((row) => {
        const columns = row.split(',');
        if (columns.length > 3) {
          livestockData.push([columns[0], +columns[1], +columns[2], +columns[3]]);
        }
      });

      const livestockChart = google.visualization.arrayToDataTable(livestockData);
      const livestockOptions = {
        title: 'Livestock Population Trends',
        hAxis: { title: 'Category' },
        vAxis: { title: 'Population' },
      };
      const chart = new google.visualization.ColumnChart(document.getElementById('livestock_chart'));
      chart.draw(livestockChart, livestockOptions);
    });

  // Pulses Chart
  fetch('Processed Data(Pulses).csv')
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split('\n').slice(2);
      const pulsesData = [['Crops', '2020/21 Area', '2020/21 Production', '2021/22 Area', '2021/22 Production', '2022/23 Area', '2022/23 Production']];
      rows.forEach((row) => {
        const columns = row.split(',');
        if (columns.length > 6) {
          pulsesData.push([columns[0], +columns[1], +columns[2], +columns[3], +columns[4], +columns[5], +columns[6]]);
        }
      });

      const pulsesChart = google.visualization.arrayToDataTable(pulsesData);
      const pulsesOptions = {
        title: 'Pulses Production Trends',
        curveType: 'function',
        legend: { position: 'bottom' },
      };
      const chart = new google.visualization.LineChart(document.getElementById('pulses_chart'));
      chart.draw(pulsesChart, pulsesOptions);
    });

  // Land Use Chart
  fetch('Processed Data(Land Use Distribution By Use).csv')
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split('\n').slice(1);
      const landUseData = [['Type', 'Bagmati', 'Gandaki', 'Karnali', 'Koshi', 'Lumbini', 'Madhesh', 'Sudurpashchim']];
      rows.forEach((row) => {
        const columns = row.split(',');
        if (columns.length > 7) {
          landUseData.push([columns[0], +columns[1], +columns[2], +columns[3], +columns[4], +columns[5], +columns[6], +columns[7]]);
        }
      });

      const landUseChart = google.visualization.arrayToDataTable(landUseData);
      const landUseOptions = {
        title: 'Land Use Distribution by Province',
        hAxis: { title: 'Type' },
        vAxis: { title: 'Area (sq km)' },
      };
      const chart = new google.visualization.BarChart(document.getElementById('land_use_chart'));
      chart.draw(landUseChart, landUseOptions);
    });
    /*for stacked column chart*/
    fetch('chemical fertilizer sales.csv')
    .then(response => response.text())
    .then(csvData => {
      const rows = csvData.split('\n').slice(1);
      const chartData = [['Province', 'AICL Urea', 'AICL DAP', 'AICL Potash', 'STCL Urea', 'STCL DAP', 'STCL Potash']];

      rows.forEach(row => {
        if (row.trim() !== '') {
          const cols = row.split(',');
          chartData.push([
            cols[0],   // Province
            parseInt(cols[1]),  // AICL Urea
            parseInt(cols[2]),  // AICL DAP
            parseInt(cols[3]),  // AICL Potash
            parseInt(cols[4]),  // STCL Urea
            parseInt(cols[5]),  // STCL DAP
            parseInt(cols[6])   // STCL Potash
          ]);
        }
      });

      const data = google.visualization.arrayToDataTable(chartData);

      const options = {
        title: 'Fertilizer Distribution by Province',
        chartArea: {width: '60%'},
        isStacked: true,
        hAxis: {
          title: 'Provinces',
        },
        vAxis: {
          title: 'Quantity'
        },
        colors: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6']
      };

      const chart = new google.visualization.ColumnChart(document.getElementById('column-chart'));
      chart.draw(data, options);
    })

    fetch('Processed Data(Cereal).csv')
          .then(response => response.text())
          .then(data => {
            const rows = data.split('\n').map(row => row.trim()).slice(1); // Skip header
            const chartData = [['Cereal', 'Area', 'Production', 'Year']];
      
            // Separate arrays for each year
            const yearData = [2077, 2078, 2079].map(() => []);
      
            rows.forEach(row => {
              const cols = row.split(',').map(col => col.trim());
              if (cols.length >= 7) {
                yearData[0].push([cols[0], parseInt(cols[1], 10) || 0, parseInt(cols[2], 10) || 0, 2077]);
                yearData[1].push([cols[0], parseInt(cols[3], 10) || 0, parseInt(cols[4], 10) || 0, 2078]);
                yearData[2].push([cols[0], parseInt(cols[5], 10) || 0, parseInt(cols[6], 10) || 0, 2079]);
              }
            });
      
            const dashboard = new google.visualization.Dashboard(document.getElementById('pie-charts'));
            // Slider for Production
            const productionSlider = new google.visualization.ControlWrapper({
                controlType: 'NumberRangeFilter',
                containerId: 'production_slider_div',
                options: {
                  filterColumnIndex: 2, // Production column
                  ui: { label: 'Filter by Value' }
                }
              });
            // Pie Chart for Area
            const areaChart = new google.visualization.ChartWrapper({
              chartType: 'PieChart',
              containerId: 'area_chart_div',
              options: {
                title: 'Cereal Area(Ha.) by Type',
                width: 400,
                height: 300,
                legend: { position: 'right' }
              },
              view: { columns: [0, 1] } // Cereal, Area
            });
      
            // Pie Chart for Production
            const productionChart = new google.visualization.ChartWrapper({
              chartType: 'PieChart',
              containerId: 'production_chart_div',
              options: {
                title: 'Cereal Production(Mt.) by Type',
                width: 400,
                height: 300,
                legend: { position: 'right' }
              },
              view: { columns: [0, 2] } // Cereal, Production
            });
      
            function updateChartsForYear() {
              const dataTable = google.visualization.arrayToDataTable(
                [['Cereal', 'Area', 'Production', 'Year'], ...yearData[currentYearIndex]]
              );
              dashboard.draw(dataTable);
            }
      
            // Bind the production slider to the charts
            dashboard.bind(productionSlider, [areaChart, productionChart]);
      
            // Initial draw for the first year
            updateChartsForYear();
      
            // Next Year Button
            document.getElementById('next_year_btn').addEventListener('click', () => {
              currentYearIndex = (currentYearIndex + 1) % yearData.length;
              updateChartsForYear();
            });
          })
          .catch(error => console.error('Error fetching or processing data:', error));
        
}
/*for combo chart*/
function loadData() {
    fetch('fresh veg stat.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(2); 
        const chartData = [['Province', 'Area (Ha.)', 'Production (Mt.)', 'Yield (Mt./Ha)']];
        
        rows.forEach(row => {
          if (row.trim() !== '') {
            const cols = row.split(',').map(col => col.replace(/"/g, '').trim()); // Remove quotes and spaces
            if (cols[0] !== 'TOTAL') { // Ignore total row
              chartData.push([
                cols[0],   // Province
                parseInt(cols[1].replace(/,/g, '')),  // Area (Ha.)
                parseInt(cols[2].replace(/,/g, '')),  // Production (Mt.)
                parseFloat(cols[3])                   // Yield (Mt./Ha)
              ]);
            }
          }
        });

        drawChart(chartData);
      })
      .catch(error => console.error('Error loading CSV:', error));
  }

  function drawChart(chartData) {
    const selectedData = [['Province', 'Area (Ha.)', 'Production (Mt.)', 'Yield (Mt./Ha)']];
    selectedData.push(chartData[currentIndex + 1]); // Skip header row

    const data = google.visualization.arrayToDataTable(selectedData);

    const options = {
      title: `Fresh Vegetables Statistics - ${chartData[currentIndex + 1][0]}`,
      chartArea: { width: '60%' },
      hAxis: { title: 'Province' },
      vAxes: {
        0: { title: 'Area (Ha.) & Production (Mt.)', format: 'short' },
        1: { title: 'Yield (Mt./Ha)', format: 'decimal' }
      },
      seriesType: 'bars',
      series: { 2: { type: 'line', targetAxisIndex: 1 } },  // Yield as line chart
      colors: ['#3366cc', '#dc3912', '#ff9900'],
      animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
      },
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.ComboChart(document.getElementById('combo-chart'));
    chart.draw(data, options);
  }

  function nextProvince() {
    fetch('fresh veg stat.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(1); // Skip header row
        const chartData = [['Province', 'Area (Ha.)', 'Production (Mt.)', 'Yield (Mt./Ha)']];
        
        rows.forEach(row => {
          if (row.trim() !== '') {
            const cols = row.split(',').map(col => col.replace(/"/g, '').trim());
            if (cols[0] !== 'TOTAL') {
              chartData.push([
                cols[0],   
                parseInt(cols[1].replace(/,/g, '')),  
                parseInt(cols[2].replace(/,/g, '')),  
                parseFloat(cols[3])                   
              ]);
            }
          }
        });

        currentIndex = (currentIndex + 1) % (chartData.length - 1);
        drawChart(chartData);
      });
  }

  
  
