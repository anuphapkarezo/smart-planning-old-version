import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Nav from "../components/Nav";
import Container from "@mui/material/Container";
import SearchMachine_Manage from "../components/SearchGroup/SearchMachine_Manage";
import "./styles/Planning_Forecast_time_Capacity.css";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export default function Planning_Manage_Machine_In_Process({ onSearch }) {
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedGroupProcess, setSelectedGroupProcess] = useState(null);

  const [error, setError] = useState(null);

  const [distinctMachine_List, setdistinctMachine_List] = useState([]);
  const [distinctMachine_Add, setdistinctMachine_Add] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen_Add, setisModalOpen_Add] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  //bind value user from localstorage
  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;
  const update_by = userName +' '+ userSurname; 

  const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // const seconds = now.getSeconds().toString().padStart(2, '0');
    const update_date = date +'/'+ month +'/'+ year +' '+ hours +':'+ minutes;

  const [disabledButtons, setDisabledButtons] = useState({});

  const fetchMachine_List = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-machine-list-management?grp_proc=${selectedGroupProcess}`
      );
      const dataFetch = await response.data;
      const rowsWithId = dataFetch.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      // Append a row for the Add button
      if (rowsWithId.length > 0) {
        rowsWithId.push({
          id: rowsWithId.length,
          factory: '',
          unit: '',
          group_process: '',
          mc_code: '',
          item_desc1: '',
          mc_status: '',
          isAddButton: true,
        });
      }
      
      setdistinctMachine_List(rowsWithId);

      const initialDisabledButtons = {};
      rowsWithId.forEach(row => {
        initialDisabledButtons[row.id] = true; // Initially disable all buttons
      });
      setDisabledButtons(initialDisabledButtons);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchMachine_Add = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-add-machine-list-in-group-process`
      );
      const dataFetch = await response.data;
      const rowsWithId = dataFetch.map((row, index) => ({
          ...row,
          id: index + 1, // You can use a better unique identifier here if available
      }));
      setdistinctMachine_Add(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  useEffect(() => {
    fetchMachine_List();
    fetchMachine_Add();
  }, [selectedGroupProcess]);


  const handleMC_StatusChange = (id, newValue) => {
    setdistinctMachine_List((prevList) =>
      prevList.map((row) =>
        row.id === id ? { ...row, mc_status: newValue } : row
      )
    );
    // setSaveButtonDisabled(false);
    setDisabledButtons(prevState => ({
      ...prevState,
      [id]: false,
    }));
  };
  
  const handleSaveEditData = (rowData) => {
    // Use the rowData parameter as needed
    // console.log(rowData);

    const { factory, unit, group_process, mc_code,  mc_status} = rowData;
    
    if ( mc_status === null || mc_status === '') {
      console.log('mc_status == null');
    } else {
      
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      swalWithZIndex.fire({
        title: "Confirm Save",
        text: "Are you sure want to update the data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get(
              `http://10.17.100.115:3001/api/smart_planning/update-machine-status?factory=${factory}&unit=${unit}&grp_proc=${group_process}&mc_code=${mc_code}&mc_status=${mc_status}&modify_by=${update_by}&modify_date=${update_date}`
            )
            .then(() => {
              // Success notification
              Swal.fire({
                icon: "success",
                title: "Update Success",
                text: "Data by Machine updated successfully",
                confirmButtonText: "OK",
              });
              fetchMachine_List();
            })
            .catch((error) => {
              console.error("Error saving data:", error);
              // Handle the error or display an error message using Swal
              Swal.fire({
                icon: "error",
                title: "Update Error",
                text: "An error occurred while updating data",
                confirmButtonText: "OK",
              });
          });
        }
      });
    }
  }

  const handleSaveAddData = (rowData) => {
    // Use the rowData parameter as needed
    const {factory, unit, group_process, mc_code, item_status} = rowData;
    // console.log('mc_code' , mc_code);
    // console.log('selectedFactory' , selectedFactory);
    // console.log('selectedUnit' , selectedUnit);
    // console.log('selectedGroupProcess' , selectedGroupProcess);
    // console.log('item_status' , item_status);
    // console.log('update_date' , update_date);
    // console.log('update_by' , update_by);
    axios
    .get(
      `http://10.17.100.115:3001/api/smart_planning/filter-count-machine?grp_proc=${selectedGroupProcess}&mc_code=${mc_code}`
    )
    .then((response) => {
      const countMcValue = response.data[0].count_mc;
      if ( countMcValue > 0) {
        openDialog();
        // console.log('Open Warning Modal');
      } else {
        closeModal_Add();
        const swalWithZIndex = Swal.mixin({
          customClass: {
            popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
          },
        });
        swalWithZIndex.fire({
          title: "Confirm Add",
          text: "Are you sure want to Add this Machine?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Add",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .get(
                `http://10.17.100.115:3001/api/smart_planning/insert-data-machine-list?mc_code=${mc_code}&factory=${selectedFactory}&unit=${selectedUnit}&grp_proc=${selectedGroupProcess}&mc_status=${item_status}&update_date=${update_date}&update_by=${update_by}`
              )
              .then(() => {
                // Success notification
                Swal.fire({
                  icon: "success",
                  title: "Add Machine Success",
                  text: "Machine added successfully",
                  confirmButtonText: "OK",
                });
                fetchMachine_List();
              })
              .catch((error) => {
                console.error("Error adding data:", error);
                // Handle the error or display an error message using Swal
                Swal.fire({
                  icon: "error",
                  title: "Add Error",
                  text: "An error occurred while Adding data",
                  confirmButtonText: "OK",
                });
            });
          } else {
            openModal_Add();
          }
        });
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }


  const columns = [
    { field: 'id', headerName: 'No.', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' , 
        renderCell: (params) => {
          if (params.row.isAddButton) {
            return <button style={{backgroundColor: '#6B8A7A' , color: 'white'}} 
            onClick={openModal_Add}>+ ADD MC +</button>;
          }
          return params.row.id + 1;
        } 
    },
    { field: 'factory', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'unit', headerName: 'Unit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'group_process', headerName: 'Group Process', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'mc_code', headerName: 'Machine No.', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'item_desc1', headerName: 'Description', width: 400 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'mc_status', headerName: 'Machine Status', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' , 
      renderCell: (params) => {
        if (params.row.isAddButton) {
          return null; // or any placeholder like an empty string
        }
        return (
          <Autocomplete
            options={['Active', 'Inactive']}
            value={params.row.mc_status || ''}
            onChange={(event, newValue) => handleMC_StatusChange(params.row.id, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            // disableClearable
            sx={{
              width: '125px', // Set width here
              backgroundColor: '#FFFDB5', // Set background color here
              '& .MuiAutocomplete-inputRoot': {
                padding: '0 !important', // Adjust padding as needed
                color: params.row.mc_status === 'Inactive' ? 'red' : 'inherit', // Set font color conditionally
              }
            }}
          />
        );
      }
    },
    { field: 'modify_date', headerName: 'Update Date', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center'},
    { field: 'modify_by', headerName: 'Update By', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'action', headerName: 'Save Edit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap', align: 'center',
      renderCell: (params) => (
        <div>
          {Object.values(params.row).some(value => value !== '' && value !== null && !params.row.isAddButton) && (
            <Button 
              variant="contained" 
              onClick={() => { handleSaveEditData(params.row); }}
              className="btn_hover hover:scale-110" 
              style={{backgroundColor: '#799351', color: 'white', width: 50, height: '35px', textAlign:'center', boxShadow: '3px 3px 5px grey'}}
              disabled={disabledButtons[params.row.id]}
              // disabled={saveButtonDisabled}
            >
              <SaveIcon />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const columns_Add = [
    { field: 'id', headerName: 'No.', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' , },
    { field: 'factory', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' , },
    { field: 'unit', headerName: 'Unit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' , },
    { field: 'group_process', headerName: 'Group Process', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'mc_code', headerName: 'Machine No.', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'item_desc1', headerName: 'Description', width: 400 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'left'},
    { field: 'item_status', headerName: 'Machine Status', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cap' , align: 'center' , },
    { field: 'action', headerName: 'Add Machine', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-cap', align: 'center',
      renderCell: (params) => (
        <div>
            <Button 
              variant="contained" 
              onClick={() => { handleSaveAddData(params.row); }}
              // onClick={() => { showModal_Add();}}
              className="btn_hover hover:scale-110" 
              style={{backgroundColor: '#799351', color: 'white', width: 50, height: '35px', textAlign:'center', boxShadow: '3px 3px 5px grey'}}
              // disabled={disabledButtons[params.row.id]}
              // disabled={saveButtonDisabled}
            >
              <AddToDriveIcon />
            </Button>
        </div>
      ),
    },
  ]
  
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
  
  const openModal_Add = () => {
    setisModalOpen_Add(true);
  };
  const closeModal_Add = () => {
    setisModalOpen_Add(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <div className="background-container">
        <Container maxWidth="lg">
          <Box>
            <Nav />
            {/* style={{ display: 'flex', flexDirection: 'row' }} */}
            <div>
              <SearchMachine_Manage
                onSearch={(queryParams) => {
                  setSelectedFactory(queryParams.factory);
                  setSelectedUnit(queryParams.unit);
                  setSelectedGroupProcess(queryParams.group_process);
                }}
              />
            </div>
          </Box>
          <Box sx={{ height: 500 , width: 1660 , marginTop: 1 , backgroundColor: '#CAE6B2'}}>
              <DataGrid
                columns={columns}
                rows={distinctMachine_List}
                // disableColumnFilter
                // disableDensitySelector
                // onRowClick={(params, event) => handleSaveEditData(params.row)}
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
                }}
              />
              
          </Box>
          {/* Modal machine List */}
          {isModalOpen_Add && (
          <Modal
            open={isModalOpen_Add}
            onClose={closeModal_Add}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box
              sx={{
                ...style_Modal,
                width: 1325,
                height: 600,
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
                        Add Machine by Group Process</label>
                </div>
                <div>
                  <IconButton onClick={closeModal_Add}>
                    <CloseIcon style={{backgroundColor: '#FF7D29'}}/>
                  </IconButton>
                </div>
              </div>
              <div style={{ height: 530, width: "100%" }}>
                <DataGrid
                  columns={columns_Add}
                  rows={distinctMachine_Add}
                  // disableColumnFilter
                  // disableDensitySelector
                  // onRowClick={(params, event) => handleSaveEditData(params.row)}
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
                  }}
                />
              </div>
            </Box>
          </Modal>
          )}
        </Container>
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle style={{backgroundColor: '#6B8A7A' , color: 'red'}}>Warning...</DialogTitle>
          <DialogContent style={{backgroundColor: '#D1D8C5'  , color: 'red'}}>
            <DialogContentText  style={{paddingTop: 20 , color: 'brown' , paddingLeft: 0}}>
                This Machine duplicate in system, Try to check again please.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: '#D1D8C5' , height: 50}}>
            <Button onClick={() => { closeDialog(); }} style={{width: 100 , backgroundColor: '#799351' , borderRadius:5 , border: '1px solid black' , color: 'white'}}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}