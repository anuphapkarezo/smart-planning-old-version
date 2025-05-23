import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import Nav from "../components/Nav";
import Container from "@mui/material/Container";
import "./styles/Planning_Product_Price_Analysis.css";
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, TextField } from '@mui/material';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from '@mui/icons-material/Cancel';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Swal from 'sweetalert2';
import { red } from "@mui/material/colors";

export default function Planning_PO_FC_bill_to({ onSearch }) {
  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;
  const ShortSurname = userSurname?.charAt(0);
  const update_by = userName +'.'+ ShortSurname; 
  userObject.update_by = update_by;
  const UpperUpdate_By = userObject?.update_by?.toUpperCase();

  const now_x = new Date();
  const year = now_x.getFullYear();
  const month_x = (now_x.getMonth() + 1).toString().padStart(2, '0');
  const date = now_x.getDate().toString().padStart(2, '0');
  const hours = now_x.getHours().toString().padStart(2, '0');
  const minutes = now_x.getMinutes().toString().padStart(2, '0');
  const update_date = date +'/'+ month_x +'/'+ year +' '+ hours +':'+ minutes;
  
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen_Edit, setisModalOpen_Edit] = useState(false);

  const [distinctPoFcMaster, setdistinctPoFcMaster] = useState([]);
  const [distinctCountFcNotMactching, setdistinctCountFcNotMactching] = useState([]);

  const [selectedRecordPoBillTo, setSelectedRecordPoBillTo] = useState(null);
  const [selectedRecordFcBillTo, setSelectedRecordFcBillTo] = useState(null);
  const [selectedRecordFcBillTo_Change, setSelectedRecordFcBillTo_Change] = useState(null);
  const [selectedRecordUpdateBy, setSelectedRecordUpdateBy] = useState(null);
  const [selectedRecordUpdateDate, setSelectedRecordUpdateDate] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const fetchDataPoFcMaster = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-data-map-po-fc-bill-to`);

      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      // console.log('rowsWithId :' , rowsWithId);
      setdistinctPoFcMaster(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError("An error occurred while fetching data Wip Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchCountFcnotMatching = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-count-po-fc-not-matching`);

      const data = await response.data;
      const count_fc = data[0].count_fc;
      setdistinctCountFcNotMactching(count_fc);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError("An error occurred while fetching data Wip Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };
  
  useEffect(() => {
    fetchDataPoFcMaster();
    fetchCountFcnotMatching();
  }, []);

  const columns = [
    ////////// Range_1 //////////
    { field: 'po_bill_to', headerName: 'PO bill-to', width: 300 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , cellClassName: 'custom-blue-bg',},
    { field: 'fc_bill_to', headerName: 'FC bill-to', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' ,
      cellClassName: (params) => params.value === null ? 'custom-red-bg' : 'custom-blue-bg',
    },
    { field: 'update_by', headerName: 'Update By', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'update_date', headerName: 'Update Date', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'edit_Val', headerName: 'Edit', width: 105 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',
      renderCell: (params) => (
        <div>
          <Button variant="contained" 
            onClick={() => { handleButtonEditClick(params.row.id); openModal_Edit(); }}
            className="btn_hover hover:scale-110" style={{backgroundColor: '#FFD95F' , color: 'black' , height: '30px' , textAlign:'center' , boxShadow: '3px 3px 5px grey' }}>
            <EditNoteIcon />
          </Button>
        </div>
      ),
      
    },
  ]

  const openModal_Edit = () => {
    setisModalOpen_Edit(true);
  };
  const closeModal_Edit = () => {
    setisModalOpen_Edit(false);

    setSelectedRecordPoBillTo(null)
    setSelectedRecordFcBillTo(null)
  };
  const handleButtonEditClick = (row) => {
    setSelectedRecordPoBillTo(row.po_bill_to);
    setSelectedRecordFcBillTo(row.fc_bill_to);
    setSelectedRecordFcBillTo_Change(row.fc_bill_to);
    setSelectedRecordUpdateBy(row.update_by);
    setSelectedRecordUpdateDate(row.update_date);
  };

  // const handlePoBillToChange = (event) => {
  //   setSelectedRecordPoBillTo(event.target.value);
  // }
  const handleFcBillToChange = (event) => {
    setSelectedRecordFcBillTo_Change(event.target.value);
  }

  const handleSave_Edit = (row) => {
    if ( selectedRecordPoBillTo == '' || selectedRecordFcBillTo == '') 
    {
      // closeModal_Edit();
      return;
    } 
    // else if (selectedRecord_Server == selectedRecord_Server_Old) {
    // } else if (selectedRecord_Port == selectedRecord_Port_Old) {
    // }
     else {
      const swalWithZIndex = Swal.mixin({
      customClass: {
      popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
      },
      });
      closeModal_Edit();

      swalWithZIndex.fire({
      title: "Confirm Save Edit",
      text: "Are you sure you want to save edit the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {

          async function fetchData() {
            try {

                
                const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-count-po-fc-bill-to-master?po_bill_to=${selectedRecordPoBillTo}&update_by=${selectedRecordUpdateBy}&update_date=${selectedRecordUpdateDate}`);
                const data = response.data;
                const count_po_fc = data[0].count_po_fc;
        
                if (count_po_fc > 0) {
                    console.log('count_po_fc:' , count_po_fc);
                    console.log('selectedRecordPoBillTo:' , selectedRecordPoBillTo);
                    console.log('selectedRecordFcBillTo_Change:' , selectedRecordFcBillTo_Change);

                    await axios.get(`http://10.17.100.115:3001/api/smart_planning/update-data-po-fc-bill-to?fc_bill_to_new=${selectedRecordFcBillTo_Change}&update_by_new=${UpperUpdate_By}&update_date_new=${update_date}&po_bill_to=${selectedRecordPoBillTo}&update_by=${selectedRecordUpdateBy}&update_date=${selectedRecordUpdateDate}`);
                } else {
                    await axios.get(`http://10.17.100.115:3001/api/smart_planning/insert-data-master-po-fc-bill-to?po_bill_to=${selectedRecordPoBillTo}&fc_bill_to=${selectedRecordFcBillTo_Change}&update_by=${UpperUpdate_By}&update_date=${update_date}`);
                }
        
                Swal.fire({
                    icon: "success",
                    title: "Save Success",
                    text: "Data master saved successfully",
                    confirmButtonText: "OK",
                });
                fetchDataPoFcMaster();
                fetchCountFcnotMatching();
            } catch (error) {
                console.error("Error saving data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Save Error",
                    text: "An error occurred while saving data",
                    confirmButtonText: "OK",
                });
            }
          }
          fetchData();
        } else {
          closeModal_Edit()
        }
      });
    } 
  }

  return (
    <>
      <div className="background-container">
        <Container maxWidth="lg">
          <Box>
            <Nav />
            <div>
              <h5
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#006769",
                  width: "500px",
                  paddingLeft: "5px",
                  marginBottom: "5px",
                  // backgroundColor: '#CAE6B2',
                }}
              >
                PO-FC-Bill-To Master
              </h5>
            </div>
            <div>
              <p style={{fontWeight: 'bold', color: distinctCountFcNotMactching > 0 ? 'red' : 'black',}}>
                ***PO Bill-to not matching ({distinctCountFcNotMactching})***
              </p>
            </div>
            <Box sx={{ height: 700 , width: 892 , marginTop: 0 , backgroundColor: '#C6E7FF'}}>

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
                      left: '70%', 
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
                  <DataGrid
                    columns={columns}
                    rows={distinctPoFcMaster}
                    slots={{ toolbar: GridToolbar }}
                    filterModel={filterModel}
                    onFilterModelChange={(newModel) => setFilterModel(newModel)}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    columnVisibilityModel={columnVisibilityModel}
                    // checkboxSelection
                    onColumnVisibilityModelChange={(newModel) =>setColumnVisibilityModel(newModel)}
                    sx={{
                      '& .MuiDataGrid-row': {
                        backgroundColor: 'white', // Change to desired color
                      },
                    }}
                    onCellClick={(event) => { 
                      handleButtonEditClick(event.row);
                    }} 
                  />
                )}
            </Box>
          </Box>
          
        </Container>
        <Modal
          open={isModalOpen_Edit}
          onClose={closeModal_Edit}
          aria-labelledby="key-weight-modal-title"
          aria-describedby="key-weight-modal-description"
        >
          <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 610 , height: 300 , bgcolor: '#CAF4FF', boxShadow: 24, p: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' , height: 20 , marginBottom: 20}}>
                <div style={{width: '100%' ,fontWeight: 'bold' , fontSize: 20 , textAlign: 'center' }}>
                    <label htmlFor="" >EDIT MASTER DATA PO-FC Bill-To</label>
                </div>
                <div>
                    <IconButton onClick={closeModal_Edit} style={{position: 'absolute', top: '10px', right: '10px',}}>
                        <CloseIcon style={{fontSize: '25px', color: 'white', backgroundColor: '#E55604'}} /> 
                    </IconButton>
                </div>
            </div>
            <div style={{ height: 210 , backgroundColor: '#E4FBFF' }}>
              
                <div style={{paddingTop: 20}}>
                    <TextField
                      // disabled
                      id="outlined-disabled"
                      label="FC Bill-To"
                      value={selectedRecordFcBillTo_Change}
                      onChange={handleFcBillToChange}
                      style={{backgroundColor: 'white' , marginLeft: 20 , marginTop: 20 , width: 200 }}
                      inputProps={{style: { textAlign: 'center' },}}
                    />    

                    <TextField
                      disabled
                      id="outlined-disabled"
                      label="PO Bill-To"
                      value={selectedRecordPoBillTo}
                      // onChange={handlePoBillToChange}
                      style={{backgroundColor: '#EEF5FF' , marginLeft: 20 , marginTop: 20 , width: 350 }}
                    />
                </div>

                <div style={{paddingTop: 10}}>
                    <TextField
                      disabled
                      id="outlined-disabled"
                      label="Update By"
                      value={UpperUpdate_By}
                      // onChange={handlePoBillToChange}
                      style={{backgroundColor: '#EEF5FF' , marginLeft: 20 , marginTop: 20 , width: 275 }}
                      inputProps={{style: { textAlign: 'center' },}}
                    />

                    <TextField
                      disabled
                      id="outlined-disabled"
                      label="Update Date"
                      value={update_date}
                      // onChange={handleFcBillToChange}
                      style={{backgroundColor: '#EEF5FF' , marginLeft: 20 , marginTop: 20 , width: 275 }}
                      inputProps={{style: { textAlign: 'center' },}}
                    />    
                </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end' , marginTop: 15 , height: 45 }}>
                <Button variant="contained" startIcon={<CancelIcon />} onClick={closeModal_Edit} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginRight: 10 , boxShadow: '3px 3px 5px grey'}}>
                    Cancel 
                </Button>
                <Button variant="contained" endIcon={<AddToPhotosIcon />} onClick={handleSave_Edit} className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey'}}>
                    SAVE
                </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}