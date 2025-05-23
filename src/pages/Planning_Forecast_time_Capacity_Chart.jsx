import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Process_STD_Leasdtime_Master.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Nav from "../components/Nav";
import Chart from 'react-apexcharts';
import Container from "@mui/material/Container";
import SearchForecastTime_Cap_Chart from "../components/SearchGroup/SearchForecastTime_Cap_Chart";
import './styles/Planning_Forecast_time_Capacity_Chart.css'; // Import the CSS file

export default function Planning_Forecast_time_Capacity_Chart({ onSearch }) {
  const [selectedFC_Period, setSelectedFC_Period] = useState(null);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedGroupProcess, setSelectedGroupProcess] = useState(null);

  const [distinctChart_data, setdistinctChart_data] = useState([]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChart_data = async () => {
    // console.log('selectedGroupProcess' , selectedGroupProcess);
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fc-time-mc-working-sec-chart?grp_proc=${selectedGroupProcess}&factory=${selectedFactory}&unit=${selectedUnit}`
      );
      const dataFetch = await response.data;
      // console.log('dataFetch' , dataFetch);

      // Organize data by graph_no
      const groupedData = dataFetch.reduce((acc, item) => {
        acc[item.graph_no] = acc[item.graph_no] || [];
        acc[item.graph_no].push(item);
        return acc;
      }, {});
      // console.log('Grouped Data:', groupedData); // Debugging: log grouped data
      setdistinctChart_data(Object.values(groupedData));
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  useEffect(() => {
    if (selectedGroupProcess) {
      fetchChart_data();
    }
  }, [selectedGroupProcess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <>
      <div className="background-container">
        <Container maxWidth="lg">
        <Nav />
        <div>
          <SearchForecastTime_Cap_Chart
            onSearch={(queryParams) => {
              setSelectedFC_Period(queryParams.fc_period);
              setSelectedFactory(queryParams.factory);
              setSelectedUnit(queryParams.unit);
              setSelectedGroupProcess(queryParams.group_processes);
            }}
          />
        </div>
        <div className="chart-grid">
          {distinctChart_data.map((graph, index) => (
            <div key={index} className="chart-item">
              {/* <h2>Graph No {graph[0].graph_no} - {graph[0].proc_grp_name}</h2> */}
              <h4 style={{fontSize: 13}}>Group : {graph[0].proc_grp_name} // (Total Machine : {graph[0].total_machine})</h4>
              <Chart
                options={{
                  chart: {
                    type: 'line',
                    toolbar: {
                      show: true,
                      tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                      },
                      autoSelected: 'zoom',
                    },
                  },
                  yaxis: {
                    // min: 0,
                    // max: 3000000,
                    // tickAmount: 6,
                    labels: {
                      formatter: (value) => formatNumberWithCommas(value)
                    },
                    axisBorder: {
                      show: true,
                      color: 'black' // Color of y-axis line
                    },
                  
                  },
                  xaxis: {
                    categories: graph.map(item => item.week_no), // Assuming each graph has the data array
                    axisBorder: {
                      show: true,
                      color: 'black' // Color of x-axis line
                    },
                  },
                  title: {
                    text: 'Forecast time & Capacity (sec)',
                    align: 'center',
                    style: {
                      fontSize: '16px'
                    }
                  },
                  markers: {
                    size: 4,
                  },
                  legend: {
                    position: 'right',
                    horizontalAlign: 'center',
                    floating: true,
                    offsetX: -40,
                    offsetY: 30,
                  },
                  grid: {
                    padding: {
                      right: 60,
                    }
                  },
                  tooltip: {
                    y: {
                      formatter: formatNumberWithCommas
                    }
                  },
                  // dataLabels: {
                  //   formatter: formatNumberWithCommas
                  // },
                }}
                series={[
                  {
                    name: 'FC time',
                    type: 'column',
                    data: graph.map(item => item.fc_time), // Assuming each graph has the data array
                  },
                  {
                    name: 'Level1',
                    type: 'line',
                    data: graph.map(item => parseFloat(item.level1)), // Assuming each graph has the data array
                  },
                  {
                    name: 'Level2',
                    type: 'line',
                    data: graph.map(item => parseFloat(item.level2)), // Assuming each graph has the data array
                  },
                  {
                    name: 'Level3',
                    type: 'line',
                    data: graph.map(item => parseFloat(item.level3)), // Assuming each graph has the data array
                  },
                  {
                    name: 'Level4',
                    type: 'line',
                    data: graph.map(item => parseFloat(item.level4)), // Assuming each graph has the data array
                  },
                ]}
                type="line"
                height={300}
                width={500}
              />
            </div>
          ))}
        </div>
        </Container>
      </div>
    </>
  );
}




