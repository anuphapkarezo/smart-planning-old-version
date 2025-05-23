import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './styles/Process_STD_Leasdtime_Master.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Nav from "../components/Nav";

export default function Product_Routing_No_STD_LT({ onSearch }) {
  const [isLoading, setIsLoading] = useState(false);

  const [distinctProdRoutNoSTD_LT, setDistinctProdRoutNoSTD_LT] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const fetchDataProdRoutNoSTD_LT = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-prod-rout-no-std-lt`);

      const data = await response.data;
      const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setDistinctProdRoutNoSTD_LT(rowsWithId);
      console.log(distinctProdRoutNoSTD_LT);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master Process STD LT');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };


  const columns = [
    { field: 'ro_prd_name', headerName: 'Product', width: 180 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'item_type', headerName: 'Item Type', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'ro_item_code', headerName: 'Product Item', width: 180 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'prd_category', headerName: 'Category', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'factory_desc', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'fac_unit_desc', headerName: 'Unit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'proc_disp', headerName: 'Process', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'proc_std_lt', headerName: 'Std. LT', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' , 
        renderCell: (params) => (
          <div style={{ color: params.row.PROC_STD_LT > 0 ? "green" : "red" , fontWeight: "bold"}}>
              {params.value}
          </div>
        )
    },
    { field: 'wip_lot', headerName: 'WIP LOT', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' ,
        renderCell: (params) => (
          <div style={{ color: params.row.wip_lot > 0 ? "red" : "green" , fontWeight: "bold"}}>
              {params.value}
          </div>
        )
    },
    { field: 'wip_status', headerName: 'WIP Status', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'pt_status', headerName: 'Product Status', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  ]

  useEffect(() => {
    fetchDataProdRoutNoSTD_LT();
  }, []);

  return (
    <>
        <Box>
        <Nav />
        <div
          className="table-container"
          style={{ height: 600, width: "1400px"}}
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
                left: '45%', 
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
                  width: "400px",
                  paddingLeft: "5px",
                  marginLeft: 20
                  }}>
                  Product Routing no standard Leadtime</p>
              <Box sx={{ width: 1440 ,  height: 570 , marginLeft: 3}}>
                    <DataGrid
                      columns={columns}
                      // disableColumnFilter
                      // disableDensitySelector
                      rows={distinctProdRoutNoSTD_LT}
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
