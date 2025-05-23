import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Process_STD_Leasdtime_Master.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Nav from "../components/Nav";

export default function Process_STD_Leasdtime_Master({ onSearch }) {
  const [isLoading, setIsLoading] = useState(false);

  const [distinctProcSTDLeadtime, setDistinctProcSTDLeadtime] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const fetchDateProcSTD_LT = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-proc-std-lt`);

      const data = await response.data;
      const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setDistinctProcSTDLeadtime(rowsWithId);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master Process STD LT');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };


  const columns = [
    { field: 'factory_desc', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'fac_unit_desc', headerName: 'Unit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'proc_disp', headerName: 'Process', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'prd_category', headerName: 'Category', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'proc_std_lt', headerName: 'Std. LT', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'proc_std_lt_unit', headerName: 'Std. LT (Unit)', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'proc_avg_std_lt', headerName: 'Avg. Std LT', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  ]

  useEffect(() => {
    fetchDateProcSTD_LT();
  }, []);

  return (
    <>
    <Box>
        <Nav />
        <div
          className="table-container"
          style={{ height: 600, width: "900px"}}
        >
          {isLoading ? ( // Render the loading indicator if isLoading is true
            <div
              className="loading-indicator"
              style={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'absolute', 
                top: '50%', 
                left: '25%', 
                transform: 'translate(-50%, -50%)', 
                zIndex: 1
              }}
            >
              <CircularProgress />{" "}
              {/* Use the appropriate CircularProgress component */}
              <p>Loading data...</p>
              {/* <p>Loading data...{Math.round(loadingPercentage)}%</p> */}
            </div>
            
          ) : (
            <Box >
              <p style={{ fontSize: 20,
                  fontWeight: "bold",
                  color: "#6528F7",
                  width: "300px",
                  paddingLeft: "5px",
                  marginLeft: 20
                  }}>
                  Process Standard Leadtime</p>
              <Box sx={{ width: 810 ,  height: 570 , marginLeft: 3}}>
                  <DataGrid
                      columns={columns}
                      // disableColumnFilter
                      // disableDensitySelector
                      rows={distinctProcSTDLeadtime}
                      slots={{ toolbar: GridToolbar }}
                      filterModel={filterModel}
                      onFilterModelChange={(newModel) => setFilterModel(newModel)}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                      columnVisibilityModel={columnVisibilityModel}
                      // checkboxSelection
                      onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel(newModel)
                      }
                    />
              </Box>
            </Box>
          )}
        </div>
      </Box>
    </>
  );
}
