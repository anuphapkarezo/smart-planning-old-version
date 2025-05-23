import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Nav from "../components/Nav";
import Container from "@mui/material/Container";
import SearchForecastTime_Cap from "../components/SearchGroup/SearchForecastTime_Cap";
import "./styles/Planning_Forecast_time_Capacity.css";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

export default function Planning_Forecast_time_Capacity({ onSearch }) {
  const [selectedFC_Period, setSelectedFC_Period] = useState(null);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedGroupProcess, setSelectedGroupProcess] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowData_Grp, setSelectedRowData_Grp] = useState(null);

  const [error, setError] = useState(null);
  const [Week_no, setWeek_no] = useState([]);
  const [Mon_date, setMon_date] = useState([]);
  const [WorkingDay, setWorkingDay] = useState([]);

  const [distinctForecast, setdistinctForecast] = useState([]);
  const [distinctMachine, setdistinctMachine] = useState([]);
  const [distinctProcess, setdistinctProcess] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen_Level, setIsModalOpen_Level] = useState(false);
  const [isModalOpen_Machine, setIsModalOpen_Machine] = useState(false);
  const [isModalOpen_GroupProcess, setIsModalOpen_GroupProcess] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const fetchWeekNo_Mondate_WorkingDay = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-get-week-and-monday-cap`
      );
      const dataFetch = await response.data;
      const week_numbers = dataFetch.map((weekObj) => weekObj.week_no);
      const mon_day = dataFetch.map((weekObj) => weekObj.mon_date);
      const working_day = dataFetch.map((weekObj) => weekObj.workingday);

      setWeek_no(week_numbers);
      setMon_date(mon_day);
      setWorkingDay(working_day);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchForecast_Time = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fc-time-mc-working-sec?factory=${selectedFactory}&unit=${selectedUnit}&grp_proc=${selectedGroupProcess}&period=${selectedFC_Period}`
      );
      const dataFetch = await response.data;
      setdistinctForecast(dataFetch);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchMachine_List = async () => {
    try {
      if (!selectedRowData) {
        // Handle the case where selectedRowData is null
        console.error("Error fetching data: selectedRowData is null");
        return;
      }
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-machine-list-by-group-process?grp_proc=${selectedRowData.GroupProcess}`
      );
      const dataFetch = await response.data;
      const rowsWithId = dataFetch.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setdistinctMachine(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchProcess_List = async () => {
    try {
      if (!selectedRowData_Grp) {
        // Handle the case where selectedRowData is null
        console.error("Error fetching data: selectedRowData is null");
        return;
      }
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-process-list-by-group?grp_proc=${selectedRowData_Grp.GroupProcess}`
      );
      const dataFetch = await response.data;
      const rowsWithId = dataFetch.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setdistinctProcess(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  useEffect(() => {
    fetchWeekNo_Mondate_WorkingDay();
    fetchForecast_Time();
  }, [selectedFC_Period , selectedFactory , selectedUnit , selectedGroupProcess]);

  useEffect(() => {
    if (selectedRowData != null) {
      fetchMachine_List();
    }
  }, [selectedRowData]);

  useEffect(() => {
    if (selectedRowData_Grp != null) {
      fetchProcess_List();
    }
  }, [selectedRowData_Grp]);
  
  const combineRows = (distinctForecast) => {
    const combinedData = {};
  
    distinctForecast.forEach((row) => {
      const key = `${row.period_no}_${row.factory}_${row.unit}_${row.proc_grp_name}_${row.level_no}`;
      if (!combinedData[key]) {
        combinedData[key] = {
          period_no: row.period_no,
          factory: row.factory,
          unit: row.unit,
          proc_grp_name: row.proc_grp_name,
          level_no: row.level_no,
          total_machine: row.total_machine,
          weeks: {}
        };
      }
  
      combinedData[key].weeks[row.week_no] = row.fc_time ?? row.workingsec;
    });
  
    return Object.values(combinedData);
  };

  const formatNumber = (number) => {
    if (number == null) return "-";
    return number.toLocaleString();
  };
  
  const combinedData = combineRows(distinctForecast);

  const openModal_LevelDef = () => {
      setIsModalOpen_Level(true);
  };
  const closeModal_LevelDef = () => {
    setIsModalOpen_Level(false);
  };

  const openModal_MachineList = () => {
    setIsModalOpen_Machine(true);
  };
  const closeModal_MachineList = () => {
    setIsModalOpen_Machine(false);
  };

  const openModal_ProcessList = () => {
    setIsModalOpen_GroupProcess(true);
  };
  const closeModal_ProcessList = () => {
    setIsModalOpen_GroupProcess(false);
  };

  const style_Modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    // bgcolor: "white",
    boxShadow: 24,
    p: 2,
  };

  const columns = [
    { field: 'factory', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'unit', headerName: 'Unit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'group_process', headerName: 'Group Process', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'mc_code', headerName: 'Machine No.', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'item_desc1', headerName: 'Description', width: 400 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'mc_status', headerName: 'Machine Status', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' ,
        renderCell: (params) => (
          <div style={{ color: params.value === 'Inactive' ? 'red' : 'inherit' }}>
            {params.value}
          </div>
        )
    },
    { field: 'update_date', headerName: 'Update Date', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'update_by', headerName: 'Update By', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
  ]
  
  const columns_Process = [
    { field: 'factory_desc', headerName: 'Factory', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'unit_desc', headerName: 'Unit', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'group_name', headerName: 'Group Process', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'proc_disp', headerName: 'Process', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
  ]

  const exportToCSV = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${year}${month}${date}${hours}${minutes}${seconds}`;

    const csvContent = [];
    const header1 = ['','','','','','',...Week_no];
    const header2 = ['','','','','','Working Day',...WorkingDay];
    const header3 = ['FC_Period', 'Factory', 'Unit', 'Group Process', 'Capacity Level', 'Total Machine', ...Mon_date];
    
    csvContent.push(header1.join(','));
    csvContent.push(header2.join(','));
    csvContent.push(header3.join(','));

    combinedData.forEach(row => {
        const rowData = [
            `"${row.period_no || ''}"`,
            `"${row.factory || ''}"`,
            `"${row.unit || ''}"`,
            `"${row.proc_grp_name || ''}"`,
            `"${row.level_no || ''}"`,
            `"${row.total_machine || ''}"`,
            ...Week_no.map(week => row.weeks[week] !== null ? `"${formatNumber(row.weeks[week])}"` : '')
        ];
        csvContent.push(rowData.join(','));
    });

    const fileName = `forecastData_${formattedDateTime}.csv`;
    const csvString = csvContent.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

  return (
    <>
      <div className="background-container">
        <Container maxWidth="lg">
          <Box>
            <Nav />
            {/* style={{ display: 'flex', flexDirection: 'row' }} */}
            <div>
              <SearchForecastTime_Cap
                onSearch={(queryParams) => {
                  setSelectedFC_Period(queryParams.fc_period);
                  setSelectedFactory(queryParams.factory);
                  setSelectedUnit(queryParams.unit);
                  setSelectedGroupProcess(queryParams.group_processes);
                }}
              />
            </div>
            <div>
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    width: "150px",
                    height: "35px",
                    backgroundColor: 'green',
                    // marginBottom: 10 , 
                    marginTop: 10 , 
                    marginLeft: 480
                  }}
                  onClick={exportToCSV}
                >
                  Export to CSV
                </Button>
            </div>
            <div 
              className="table-responsive_table-fullscreen"
              // style={{ overflowY: "auto", maxHeight: "650px" }}
              // style={{ height: 800, width: 1770, marginTop: "5px" }}
            >
              {isLoading ? ( // Render the loading indicator if isLoading is true
                <div
                  className="loading-indicator"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                  }}
                >
                  <CircularProgress />{" "}
                  {/* Use the appropriate CircularProgress component */}
                  <p>Loading data...</p>
                  {/* <p>Loading data...{Math.round(loadingPercentage)}%</p> */}
                </div>
              ) : (
                <table
                  className="table table-striped table-bordered table-hover blue-theme small"
                  style={{
                    fontSize: "12px",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    marginTop: 10
                  }}
                >
                  <thead
                    className="thead-dark"
                    style={{ position: "sticky", top: "0", zIndex: "1" }}
                  >
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "White",
                          height: "30px",
                          // width: "90px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "80px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "80px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "100px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "100px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "100px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      {Week_no.map((week, index) => {
                        return (
                          <th
                            key={index}
                            style={{
                              backgroundColor: index === 0 || index === 1 || index === 2 ? "#DDDDDD" : '#A1DD70' ,
                              textAlign: "center",
                              width: "62px",
                            }}
                          >
                            {week}
                          </th>
                        );
                      })}
                    </tr>
                    {/* Row 2 */}
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "White",
                          height: "30px",
                          // width: "90px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "80px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "80px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "100px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#AED2FF",
                          height: "30px",
                          // width: "100px",
                        }}
                      >
                        {/* Week */}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "30px",
                          width: "85px",
                        }}
                      >
                        Working Day 
                      </th>
                     
                      {WorkingDay.map((workday, index) => {
                        return (
                          <th
                            key={index}
                            style={{
                              // backgroundColor: "#A1DD70",
                              backgroundColor: index === 0 || index === 1 || index === 2 ? "#DDDDDD" : '#A1DD70' ,
                              textAlign: "center",
                              width: "62px",
                            }}
                          >
                            {workday}
                          </th>
                        );
                      })}
                    </tr>
                    {/* Row 3 */}
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "40px",
                          width: "70px",
                        }}
                      >
                        FC_Period
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "40px",
                          width: "60px",
                        }}
                      >
                        Factory
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "40px",
                          width: "45px",
                        }}
                      >
                        Unit
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "40px",
                          width: "70px",
                          whiteSpace: "pre-wrap",
                          lineHeight: "20px",
                        }}
                      >
                        Group{"\n"}Process
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "40px",
                          width: "125px",
                          whiteSpace: "pre-wrap",
                          lineHeight: "20px",
                        }}
                      >
                        Capacity Level
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#CAE6B2",
                          height: "40px",
                          width: "65px",
                          whiteSpace: "pre-wrap",
                          lineHeight: "20px",
                        }}
                      >
                        Total{"\n"}Machine
                      </th>
                      {Mon_date.map((monday, index) => {
                        return (
                          <th
                            key={index}
                            style={{
                              // backgroundColor: "#A1DD70",
                              backgroundColor: index === 0 || index === 1 || index === 2 ? "#DDDDDD" : '#A1DD70' ,
                              textAlign: "center",
                              width: "62px",
                            }}
                          >
                            {monday}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {combinedData.map((row, rowIndex) => (
                      <tr key={rowIndex} style={row.level_no.includes('Level5 FC_Time(sec)')? { backgroundColor: '#7ABA78' , color: 'black'}: {}}>
                        <td style={{ textAlign: 'center' }}>{row.period_no}</td>
                        <td style={{ textAlign: 'center' }}>{row.factory}</td>
                        <td style={{ textAlign: 'center' }}>{row.unit}</td>
                        <td style={{ paddingLeft: 5 , 
                                      cursor:'pointer' , 
                                      color: 'blue' , 
                                      textDecoration:' underline'}}
                                      onClick={() => {
                                        setSelectedRowData_Grp({
                                          FC_Period: row.period_no,
                                          Factory: row.factory,
                                          Unit: row.unit,
                                          GroupProcess: row.proc_grp_name
                                        });
                                        openModal_ProcessList();
                                      }}
                                      >{row.proc_grp_name}</td>
                        <td style={{ paddingLeft: 5 , 
                                      cursor:'pointer' , 
                                      color: 'blue' , 
                                      textDecoration:' underline'}}
                                      onClick={() => {
                                        openModal_LevelDef();
                                  }}>{row.level_no}
                        </td>
                        <td style={{ textAlign: 'center' , 
                                      cursor: row.total_machine > 0 ? 'pointer' : 'default' , 
                                      color: 'blue' , 
                                      textDecoration:' underline' ,}}
                                      onClick={() => {
                                        setSelectedRowData({
                                          FC_Period: row.period_no,
                                          Factory: row.factory,
                                          Unit: row.unit,
                                          GroupProcess: row.proc_grp_name
                                        });
                                        openModal_MachineList();
                                      }}
                                      >{row.total_machine ?? ""}
                        </td>
                        {Week_no.map((week, index) => (
                          <td key={index} style={{ textAlign: 'center' }}>
                            {formatNumber(row.weeks[week]) ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* Modal */}
              {isModalOpen_Level && (
                <Modal
                  open={isModalOpen_Level}
                  onClose={closeModal_LevelDef}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1600,
                      height: 260,
                      backgroundColor: "#CAE6B2",
                    }}
                  >
                    {/* <h3 style={{textAlign: 'center'}}>PO Balance by Details</h3> */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "20px",
                          marginBottom: "10px",
                        }}
                      >
                        <label htmlFor="" style={{ fontSize: '30px' , 
                                                    // paddingTop: 10 , 
                                                    color: 'blue' , 
                                                    textDecoration: 'underline'}}>
                              Level Definitions</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_LevelDef}>
                          <CloseIcon style={{backgroundColor: '#FF7D29'}}/>
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <table style={{marginLeft: 10 , marginRight: 10}}>
                        <thead
                          className="thead-dark"
                          style={{ backgroundColor: '#7ABA78'}}
                        >
                          <tr>
                            <th
                              style={{
                                textAlign: "center",
                                height: "40px",
                                width: "150px",
                                border: '1px solid black',
                                fontSize: 16
                              }}
                            >
                              Capacity level
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                height: "40px",
                                width: "600px",
                                border: '1px solid black',
                                fontSize: 16,
                                fontWeight: 'bold'
                              }}
                            >
                              Definitions
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                height: "40px",
                                width: "500px",
                                border: '1px solid black',
                                fontSize: 16,
                                fontWeight: 'bold'
                              }}
                            >
                              Calculation Working Hour/Days
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                height: "40px",
                                width: "300px",
                                border: '1px solid black',
                                fontSize: 16,
                                fontWeight: 'bold'
                              }}
                            >
                              Working Hour/Days
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>Level1</th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              Working days and no overtime. (Monday - Friday)
                            </th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              7.75 Hour x 2 Shift = 15.5 Hours
                            </th>
                            <th style={{textAlign: "right", paddingRight: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>
                              15.5
                            </th>
                          </tr>

                          <tr>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>Level2</th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              Working days include overtime. (Monday - Friday)
                            </th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              11 Hour x 2 Shift = 22 Hours
                            </th>
                            <th style={{textAlign: "right", paddingRight: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>
                              22
                            </th>
                          </tr>

                          <tr>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>Level3</th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              Working days and Saturdays include overtime. (Monday - Saturday)
                            </th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              11 Hour x 2 Shift = 22 Hours
                            </th>
                            <th style={{textAlign: "right", paddingRight: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>
                              22
                            </th>
                          </tr>

                          <tr>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>Level4</th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              Working days for the DN Shift. (Monday - Sunday)
                            </th>
                            <th style={{textAlign: "left", paddingLeft: 10 , backgroundColor: 'white' , border: '1px solid black'}}>
                              11 Hour x 2 Shift = 22 Hours
                            </th>
                            <th style={{textAlign: "right", paddingRight: 10 , backgroundColor: '#ACD793' , border: '1px solid black'}}>
                              22
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Box>
                </Modal>
              )}

              {/* Modal machine List */}
              {isModalOpen_Machine && (
                <Modal
                  open={isModalOpen_Machine}
                  onClose={closeModal_MachineList}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1425,
                      height: 730,
                      backgroundColor: "#CAE6B2",
                    }}
                  >
                    {/* <h3 style={{textAlign: 'center'}}>PO Balance by Details</h3> */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "20px",
                          marginBottom: "10px",
                        }}
                      >
                        <label htmlFor="" style={{ fontSize: '30px' , 
                                                    // paddingTop: 10 , 
                                                    color: 'blue' , 
                                                    textDecoration: 'underline'}}>
                              Machine in Group process</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_MachineList}>
                          <CloseIcon style={{backgroundColor: '#FF7D29'}}/>
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 650, width: "100%" , backgroundColor: '#CAE6B2'}}>
                      <DataGrid
                        columns={columns}
                        // disableColumnFilter
                        // disableDensitySelector
                        rows={distinctMachine}
                        slots={{ toolbar: GridToolbar }}
                        filterModel={filterModel}
                        onFilterModelChange={(newModel) => setFilterModel(newModel)}
                        slotProps={{ toolbar: { showQuickFilter: true } }}
                        columnVisibilityModel={columnVisibilityModel}
                        // checkboxSelection
                        onColumnVisibilityModelChange={(newModel) =>
                          setColumnVisibilityModel(newModel)
                        }
                        sx={{
                          // '& .MuiDataGrid-root': {
                          //   backgroundColor: 'lightyellow', // Change to desired color
                          // },
                          // '& .MuiDataGrid-columnHeaders': {
                          //   backgroundColor: 'lightyellow', // Change to desired color
                          // },
                          '& .MuiDataGrid-row': {
                            backgroundColor: 'lightyellow', // Change to desired color
                          },
                          // '& .MuiDataGrid-cell': {
                          //   backgroundColor: 'lightyellow', // Change to desired color
                          // },
                          '& .MuiDataGrid-footerContainer': {
                            // backgroundColor: 'lightyellow', // Change to desired color
                          },
                        }}
                      />  
                    </div>
                  </Box>
                </Modal>
              )}

              {/* Modal machine List */}
              {isModalOpen_GroupProcess && (
                <Modal
                  open={isModalOpen_GroupProcess}
                  onClose={closeModal_ProcessList}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 565,
                      height: 700,
                      backgroundColor: "#CAE6B2",
                    }}
                  >
                    {/* <h3 style={{textAlign: 'center'}}>PO Balance by Details</h3> */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "20px",
                          marginBottom: "10px",
                        }}
                      >
                        <label htmlFor="" style={{ fontSize: '30px' , 
                                                    // paddingTop: 10 , 
                                                    color: 'blue' , 
                                                    textDecoration: 'underline'}}>
                              Process List</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_ProcessList}>
                          <CloseIcon style={{backgroundColor: '#FF7D29'}}/>
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 620, width: "100%" , backgroundColor: '#CAE6B2'}}>
                      <DataGrid
                        columns={columns_Process}
                        rows={distinctProcess}
                        slots={{ toolbar: GridToolbar }}
                        filterModel={filterModel}
                        onFilterModelChange={(newModel) => setFilterModel(newModel)}
                        slotProps={{ toolbar: { showQuickFilter: true } }}
                        columnVisibilityModel={columnVisibilityModel}
                        // checkboxSelection
                        onColumnVisibilityModelChange={(newModel) =>
                          setColumnVisibilityModel(newModel)
                        }
                        sx={{
                          '& .MuiDataGrid-row': {
                            backgroundColor: 'lightyellow', // Change to desired color
                          },
                          '& .MuiDataGrid-footerContainer': {
                          },
                        }}
                      />  
                    </div>
                  </Box>
                </Modal>
              )}
            </div>
          </Box>
        </Container>
      </div>
    </>
  );
}