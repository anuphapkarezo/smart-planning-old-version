import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import Nav from "../components/Nav";
import Container from "@mui/material/Container";
import "./styles/Planning_Product_Price_Analysis.css";
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, TextField } from '@mui/material';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from "@mui/icons-material/Edit";
import Swal from 'sweetalert2';
import ReactApexChart from 'react-apexcharts';

export default function Planning_Product_Price_Analysis({ onSearch }) {
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [distinctPriceList, setdistinctPriceList] = useState([]);
  const [distinctPriceListSummary, setdistinctPriceListSummary] = useState([]);

  const [selectedRecordFactory, setSelectedRecordFactory] = useState(null);
  const [selectedRecordProductItem, setSelectedRecordProductItem] = useState(null);
  const [selectedRecordProductName, setSelectedRecordProductName] = useState(null);
  const [selectedRecordProductSeries, setSelectedRecordProductSeries] = useState(null);
  const [selectedRecordCrName, setSelectedRecordCrName] = useState(null);
  const [selectedRecordStatus, setSelectedRecordStatus] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  const [columnVisibilityModel_Summary, setColumnVisibilityModel_Summary] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [filterModel_Summary, setFilterModel_Summary] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const fetchDataPriceList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-price-analysis`);

      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      // console.log('rowsWithId :' , rowsWithId);
      setdistinctPriceList(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError("An error occurred while fetching data Wip Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchDataPriceListSummary = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-price-analysis-summary`);

      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      // console.log('rowsWithId :' , rowsWithId);
      setdistinctPriceListSummary(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError("An error occurred while fetching data Wip Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };
  
  useEffect(() => {
    fetchDataPriceList();
    fetchDataPriceListSummary();
    fetchBasicBarChartData();
  }, []);

  const columns = [
    ////////// Range_1 //////////
    { field: 'factory_desc', headerName: 'Ship Factory', width: 110 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , 
      valueFormatter: (params) => {
        return params.value === 'NaN' ? '-' : params.value;
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'prd_item_code', headerName: 'Product Item', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , cellClassName: 'custom-blue-bg',},
    { field: 'prd_name', headerName: 'Product Name', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , cellClassName: 'custom-blue-bg',},
    { field: 'pd_series', headerName: 'Series', width: 80 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'prd_status', headerName: 'Product Status', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'cr_name', headerName: 'CR Name', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , 
      valueFormatter: (params) => {
        return params.value === 'NaN' ? '-' : params.value;
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'mat_cost', headerName: 'ML', width: 90 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'right' ,
      valueFormatter: (params) => {
        // Attempt to convert the string to a number
        const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));
  
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(2);
        } else {
          return "Invalid Data"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'lbr_cost', headerName: 'LB', width: 90 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'right' ,
      valueFormatter: (params) => {
        // Attempt to convert the string to a number
        const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));
  
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(2);
        } else {
          return "Invalid Data"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'bdn_cost', headerName: 'BD', width: 90 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'right' ,
      valueFormatter: (params) => {
        // Attempt to convert the string to a number
        const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));
  
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(2);
        } else {
          return "Invalid Data"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'tt_cost', headerName: 'Total Cost', width: 90 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'right' ,
      valueFormatter: (params) => {
        // Attempt to convert the string to a number
        const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));
  
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(2);
        } else {
          return "Invalid Data"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-blue-bg',
    },
    ////////// Range_1 //////////

    ////////// Range_2 //////////
    { field: 'qty_fg', headerName: 'QTY FG', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-cost' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == 0) {
          return '-';
        }
        const value = parseInt(params.value, 10);
        return value.toLocaleString();
      },
      cellClassName: 'custom-cream-bg',
    },
    { field: 'qty_wip', headerName: 'QTY WIP', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-cost' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == 0) {
          return '-';
        }
        const value = parseInt(params.value, 10);
        return value.toLocaleString();
      },
      cellClassName: 'custom-cream-bg',
    },
    { field: 'qty_inv', headerName: 'QTY INV', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-cost' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == 0) {
          return '-';
        }
        const value = parseInt(params.value, 10);
        return value.toLocaleString();
      },
      cellClassName: 'custom-cream-bg',
    },
    { field: 'qty_fc', headerName: 'QTY FC', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-cost' , align: 'right' ,
      valueFormatter: (params) => {
        if (!params.value) return '-';
    
        // Convert value to a number
        const numericValue = parseFloat(params.value.toString().replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          // Format with comma separators
          return numericValue === 0 
            ? '-' 
            : numericValue % 1 === 0 
              ? numericValue.toLocaleString() // Integer format
              : numericValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Float format
        } else {
          return "Invalid Data"; // Handle invalid numbers
        }
      },
      cellClassName: 'custom-cream-bg',
    },
    { field: 'qty_po_bal', headerName: 'QTY PO', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-cost' , align: 'right' ,
      valueFormatter: (params) => {
        if (!params.value) return '-';
    
        // Convert value to a number
        const numericValue = parseFloat(params.value.toString().replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          // Format with comma separators
          return numericValue === 0 
            ? '-' 
            : numericValue % 1 === 0 
              ? numericValue.toLocaleString() // Integer format
              : numericValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Float format
        } else {
          return "Invalid Data"; // Handle invalid numbers
        }
      },
      cellClassName: 'custom-cream-bg',
    },
    ////////// Range_2 //////////

    ////////// Range_3 //////////
    { field: 'fc_bill_to', headerName: 'FC Bill To', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'center' ,
      valueFormatter: (params) => {
        return params.value === '0' ? '-' : params.value;
      },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'prd_price', headerName: 'Product Price [FPC]', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'right' , 
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      // valueFormatter: (params) => {
      //   // Ensure the value is a string before applying replace
      //   const value = params.value ? String(params.value) : '';
    
      //   // Attempt to convert the cleaned string to a number
      //   const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
      //   // Check if the value is a valid number
      //   if (!isNaN(numericValue)) {
      //     // If the number has decimals, show 4 decimal places; otherwise, show as an integer
      //     return numericValue % 1 === 0 ? numericValue.toFixed(0) : numericValue.toFixed(2);
      //   } else {
      //     return "-"; // or any default value or an empty string
      //   }
      // },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'prd_currency', headerName: 'Unit Price', width: 90 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'center' , 
      valueFormatter: (params) => {
        return params.value === '0' ? '-' : params.value;
      },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'exr_rate', headerName: 'Exchange Rate [THB]', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'right' , 
      valueFormatter: (params) => {
        if (!params.value) return '-';
    
        // Convert value to a number
        const numericValue = parseFloat(params.value.toString().replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          // Format with comma separators
          return numericValue === 0 
            ? '-' 
            : numericValue % 1 === 0 
              ? numericValue.toLocaleString() // Integer format
              : numericValue.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); // Float format
        } else {
          return "Invalid Data"; // Handle invalid numbers
        }
      },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'prd_price_thb', headerName: 'Product Price [THB]', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'right' , 
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'total_fc_amt_thb', headerName: 'FC Amount [THB]', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'center' ,
      valueFormatter: (params) => {
        if (!params.value) return '-';
    
        // Convert value to a number
        const numericValue = parseFloat(params.value.toString().replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          // Format with comma separators
          return numericValue === 0 
            ? '-' 
            : numericValue % 1 === 0 
              ? numericValue.toLocaleString() // Integer format
              : numericValue.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); // Float format
        } else {
          return "Invalid Data"; // Handle invalid numbers
        }
      },
      cellClassName: 'custom-orange-bg',
    },
    ////////// Range_3 //////////
    
    ////////// Range_4 //////////
    { field: 'po_bill_to', headerName: 'PO Bill To', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'left' ,
      valueFormatter: (params) => {
        return params.value === '0' ? '-' : params.value;
      },
      cellClassName: 'custom-green-bg',
    },
    { field: 'po_price', headerName: 'PO Price', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'center' ,
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-green-bg',
    },
    { field: 'so_curr', headerName: 'PO Unit Price', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'center' ,
      valueFormatter: (params) => {
        return params.value === '0' ? '-' : params.value;
      },
      cellClassName: 'custom-green-bg',
    },
    { field: 'po_price_thb', headerName: 'PO Price [THB]', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'center' ,
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-green-bg',
    },
    { field: 'total_po_amt_thb', headerName: 'PO Amount [THB]', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'center' ,
      valueFormatter: (params) => {
        if (!params.value) return '-';
    
        // Convert value to a number
        const numericValue = parseFloat(params.value.toString().replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          // Format with comma separators
          return numericValue === 0 
            ? '-' 
            : numericValue % 1 === 0 
              ? numericValue.toLocaleString() // Integer format
              : numericValue.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); // Float format
        } else {
          return "Invalid Data"; // Handle invalid numbers
        }
      },
      cellClassName: 'custom-green-bg',
    },
    ////////// Range_4 //////////

    ////////// Range_5 //////////
    { field: 'fpc_price_cal', headerName: 'CHECK FPC PRICE', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'po_price_cal', headerName: 'CHECK PO PRICE', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'inv_qty_cal', headerName: 'CHECK INV QTY', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'wip_qty_cal', headerName: 'CHECK WIP QTY', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'fg_qty_cal', headerName: 'CHECK FG QTY', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'chk_wip_fg', headerName: 'CHECK WIP/FG', width: 140 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'chk_price_fpc_po', headerName: 'CHECK PRICE [FPC,PO]', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'diff_value', headerName: 'PRICE DIFF.', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'right' , 
      valueFormatter: (params) => {
        // Get the full row data using the row ID
        const row = params.api.getRow(params.id);
    
        // Ensure row exists and chk_price_fpc_po is "COMPARE"
        if (!row || row.chk_price_fpc_po !== "COMPARE") {
          return "-";
        }
    
        // Ensure value exists and is a string before applying replace
        const numericValue = parseFloat(params.value ? String(params.value).replace(/[^0-9.-]+/g, "") : "");
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? "0" : numericValue.toFixed(4);
        } else {
          return "-"; // Default fallback
        }
      },
      cellClassName: 'custom-blue-bg',
    },
    ////////// Range_5 //////////

    // { field: 'fpc_price_val', headerName: 'FPC PRICE VALUE', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},

    // Wait confirm
    // { field: 'price_diff', headerName: 'PRICE DIFF.', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-price-diff' , align: 'center'},
    // { field: 'perc_diff', headerName: '% DIFF.', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-price-diff' , align: 'center'},
    //

    // Wait confirm
    // { field: 'price_status', headerName: 'Product Status', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center'},
    //
  ]

  const columns_summary = [
    { field: 'factory', headerName: 'Ship Factory', width: 110 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , 
      valueFormatter: (params) => {
        return params.value === 'NaN' ? '-' : params.value;
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'prd_item_code', headerName: 'Product Item', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , cellClassName: 'custom-blue-bg',},
    { field: 'prd_name', headerName: 'Product Name', width: 170 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , cellClassName: 'custom-blue-bg',},
    { field: 'pd_series', headerName: 'Series', width: 80 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'prd_status', headerName: 'Product Status', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'center' , cellClassName: 'custom-blue-bg',},
    { field: 'cr_name', headerName: 'CR Name', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header-price' , align: 'left' , 
      valueFormatter: (params) => {
        return params.value === 'NaN' ? '-' : params.value;
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'prd_price', headerName: 'FPC Price', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'right' , 
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'prd_currency', headerName: 'Unit', width: 60 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'center' , 
      valueFormatter: (params) => {
        return params.value === '0' ? '-' : params.value;
      },
      cellClassName: 'custom-orange-bg',
    },
    { field: 'prd_price_thb', headerName: 'FPC Price [THB]', width: 140 , headerAlign: 'center' , headerClassName: 'bold-header-price-fpc' , align: 'right' , 
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-orange-bg',
    },
    
    { field: 'po_price', headerName: 'PO Price', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'right' ,
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-green-bg',
    },
    { field: 'so_curr', headerName: 'Unit', width: 60 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'center' ,
      valueFormatter: (params) => {
        return params.value === '0' ? '-' : params.value;
      },
      cellClassName: 'custom-green-bg',
    },
    { field: 'po_price_thb', headerName: 'PO Price [THB]', width: 140 , headerAlign: 'center' , headerClassName: 'bold-header-price-fc' , align: 'right' ,
      valueFormatter: (params) => {
        // Ensure the value is a string before applying replace
        const value = params.value ? String(params.value) : '';
    
        // Attempt to convert the cleaned string to a number
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? '-' : numericValue.toFixed(4);
        } else {
          return "-"; // or any default value or an empty string
        }
      },
      cellClassName: 'custom-green-bg',
    },

    { field: 'chk_price_fpc_po', headerName: 'CHECK PRICE [FPC,PO]', width: 190 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',},
    { field: 'diff_value', headerName: 'PRICE DIFF.', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'right' , 
      valueFormatter: (params) => {
        // Get the full row data using the row ID
        const row = params.api.getRow(params.id);
        // Ensure row exists and chk_price_fpc_po is "COMPARE"
        if (!row || row.chk_price_fpc_po !== "COMPARE") {
          return "-";
        }
        const numericValue = parseFloat(params.value ? String(params.value).replace(/[^0-9.-]+/g, "") : "");
        // Check if the value is a valid number
        if (!isNaN(numericValue)) {
          return numericValue === 0 ? "0" : numericValue.toFixed(4);
        } else {
          return "-"; // Default fallback
        }
      },
      cellClassName: 'custom-blue-bg',
    },
    { field: 'pln_conf', headerName: 'STATUS', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',
      valueFormatter: (params) => {
        return params.value === null ? '-' : params.value;
      },
    },
    { field: 'submit', headerName: 'CONFIRM', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header-cal' , align: 'center', cellClassName: 'custom-blue-bg',
      renderCell: (params) => {
        // console.log('Row', params.row); // Add this line to log the row object
        return (
          <div>
            <button 
              style={{backgroundColor: 'orange', margin: 5}}
              className="btn_hover"
              onClick={() => { handleConfirmClick(params.row);}}
            >
              <EditIcon />
            </button>
          </div>
        );
      },
    },
  ]

  const handleConfirmClick = (row) => {
    setSelectedRecordFactory(row.factory)
    setSelectedRecordProductItem(row.prd_item_code)
    setSelectedRecordProductName(row.prd_name)
    setSelectedRecordProductSeries(row.pd_series)
    setSelectedRecordCrName(row.cr_name)
    setSelectedRecordStatus(row.pln_conf)
  };

  const handleInsertConfirm = (row) => {
    if ( selectedRecordStatus == 'CONFIRM' ) {
    } else {
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      swalWithZIndex.fire({
        title: "Confirm Different",
        text: "Are you sure you want to confirm this value?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Confirm",
        cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) 
            {
              axios
              .get(
                `http://10.17.100.115:3001/api/smart_planning/insert-planner-confirm-diff?factory=${selectedRecordFactory}&prd_item=${selectedRecordProductItem}&prd_name=${selectedRecordProductName}&prd_series=${selectedRecordProductSeries}&cr_name=${selectedRecordCrName}`
              )
              .then(() => {
                fetchDataPriceList();
                fetchDataPriceListSummary();
                
                setSelectedRecordFactory(null)
                setSelectedRecordProductItem(null)
                setSelectedRecordProductName(null)
                setSelectedRecordProductSeries(null)
                setSelectedRecordCrName(null)
                setSelectedRecordStatus(null)
              })
              .then(() => {
                // Success notification
                Swal.fire({
                  icon: "success",
                  title: "Confirm Success",
                  text: "Planner Confirmed successfully",
                  confirmButtonText: "OK",
                });
              })
              .catch((error) => {
                console.error("Error Confirming data:", error);
                // Handle the error or display an error message using Swal
                Swal.fire({
                  icon: "error",
                  title: "Confirm Error",
                  text: "An error occurred while Confirming data",
                  confirmButtonText: "OK",
                });
              });

            } else {
              setSelectedRecordFactory(null)
              setSelectedRecordProductItem(null)
              setSelectedRecordProductName(null)
              setSelectedRecordProductSeries(null)
              setSelectedRecordCrName(null)
              setSelectedRecordStatus(null)
            }
      });
      // console.log('selectedRecordFactory :', selectedRecordFactory);
      // console.log('selectedRecordProductItem :', selectedRecordProductItem);
      // console.log('selectedRecordProductName :', selectedRecordProductName);
      // console.log('selectedRecordProductSeries :', selectedRecordProductSeries);
      // console.log('selectedRecordCrName :', selectedRecordCrName);
      // console.log('selectedRecordStatus :', selectedRecordStatus);
    }
  };

  useEffect(() => {
    if ( selectedRecordFactory !== null || selectedRecordProductItem !== null || selectedRecordProductName !== null || selectedRecordProductSeries !== null || selectedRecordCrName !== null ) {
      handleInsertConfirm();
    }
  }, [selectedRecordFactory, selectedRecordProductItem, selectedRecordProductName, selectedRecordProductSeries, selectedRecordCrName]);

  const [state, setState] = useState({
    series: [],
    options: {}
  });

  const fetchBasicBarChartData = async () => {
    try {
      setIsLoading(true);
      const StartD = new Date();
      StartD.setDate(StartD.getDate() - 7);
      const year = StartD.getFullYear();
      const month_x = (StartD.getMonth() + 1).toString().padStart(2, '0');
      const date = StartD.getDate().toString().padStart(2, '0');
      const StartDate = date + '/' + month_x + '/' + year;
  
      const EndD = new Date();
      EndD.setDate(EndD.getDate() + 3);
      const yearE = EndD.getFullYear();
      const month_xE = (EndD.getMonth() + 1).toString().padStart(2, '0');
      const dateE = EndD.getDate().toString().padStart(2, '0');
      const EndDate = dateE + '/' + month_xE + '/' + yearE;
  
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-price-analysis-summary-chart?StartDate=${StartDate}&EndDate=${EndDate}`
      );
      const data = response.data;
      // console.log('data' , data);

      const categories = data.map(item => item.date_cim);
      const countOkData = data.map(item => Number(item.count_ok));
      const countNgData = data.map(item => Number(item.count_ng));
      const countNgPoData = data.map(item => Number(item.count_ng_po));

      setState({
        series: [
          {
            name: 'Price Normal',
            data: countOkData
          },
          {
            name: 'No PO Compare',
            data: countNgPoData
          },
          {
            name: 'Price AbNormal',
            data: countNgData
          },
        ],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%'
          },
          title: {
            text: 'Product Pricing Summary Trend Update',
            align: 'center',
          },
          colors: ['#81E7AF', '#DBDBDB', '#7D0A0A'],
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          xaxis: {
            categories: categories
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'right',
            offsetX: 0,
            offsetY: 50
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(2) + "%";
            },
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              colors: ['#000000'] // white text color inside bar
            }
          },
        }
      });

    } catch (error) {
      console.error('Error fetching basic bar chart data:', error);
      // setError('An error occurred while fetching basic bar chart data');
    } finally {
      setIsLoading(false);
    }
  };
  
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
                  marginBottom: "20px",
                  // backgroundColor: '#CAE6B2',
                }}
              >
                Product Pricing Summary
              </h5>
            </div>
            <Box sx={{ height: 720 , width: 1750 , marginTop: 1 , backgroundColor: '#C6E7FF'}}>

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
                    columns={columns_summary}
                    rows={distinctPriceListSummary}
                    slots={{ toolbar: GridToolbar }}
                    filterModel={filterModel_Summary}
                    onFilterModelChange={(newModel) => setFilterModel_Summary(newModel)}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    columnVisibilityModel={columnVisibilityModel_Summary}
                    // checkboxSelection
                    onColumnVisibilityModelChange={(newModel) =>setColumnVisibilityModel_Summary(newModel)}
                    sx={{
                      '& .MuiDataGrid-row': {
                        backgroundColor: 'white', // Change to desired color
                      },
                    }}
                  />
                )}
            </Box>
          </Box>
          <Box>
          <Box sx={{ width: 850, height: 370, backgroundColor: '#FFF3CF', marginTop: 5 , border: '1px solid black', borderRadius: 5 }}>
            <ReactApexChart options={state.options} series={state.series} type="bar" height={370} />
            {/* <Chart options={chartData.options} series={chartData.series} type="bar" height={400} /> */}
          </Box>
          </Box>
          <Box>
            <div>
              <h5
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#006769",
                  width: "500px",
                  paddingLeft: "5px",
                  marginBottom: "20px",
                  // backgroundColor: '#CAE6B2',
                }}
              >
                Product Pricing Analysis
              </h5>
            </div>
            <Box sx={{ height: 720 , width: 1750 , marginTop: 1 , marginBottom: 5, backgroundColor: '#C6E7FF'}}>
                <DataGridPro
                  columns={columns}
                  rows={distinctPriceList}
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
                />
            </Box>
          </Box>
          
        </Container>
      </div>
    </>
  );
}