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
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import TableChartIcon from '@mui/icons-material/TableChart';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Planning_Product_Master({ onSearch }) {
  const Custom_Progress = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="loader"></div>
    <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#3498db' }}>Loading Data...</div>
    <style jsx>{`
        .loader {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        }
        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
    `}</style>
    </div>
  );

  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFromProduct, setSelectedFromProduct] = useState(null);
  const [selectedToProduct, setSelectedToProduct] = useState(null);

  const [distinctProduct, setDistinctProduct] = useState([]);
  const [distinctProductMaster, setDistinctProductMaster] = useState([]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "http://10.17.100.115:3001/api/smart_planning/filter-product-list"
      );
      const dataProduct = response.data;
      setDistinctProduct(dataProduct);
    } catch (error) {
      console.error(`Error fetching distinct data ProductList: ${error}`);
    }
  };
  
  useEffect(() => {
    fetchProduct();
  }, [selectedFromProduct, selectedToProduct,]);

  const handleFromProductChange = (event, newValue) => {
    setSelectedFromProduct(newValue);
    setSelectedToProduct(newValue);
  };
  const handleToProductChange = (event, newValue) => {
    setSelectedToProduct(newValue);
  };
  const handleSearch = async () => {
    const fromPrd = selectedFromProduct?.prd_name?.trim() || '';
    const toPrd = selectedToProduct?.prd_name?.trim() || '';
    // console.log('fromPrd>' , fromPrd);
    // console.log('toPrd>' , toPrd);
    if (fromPrd === '' && toPrd === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Warning !',
        text: 'Please select FromProduct & ToProduct.',
        confirmButtonColor: '#4E71FF',
      });
      return;
    }
    // console.log('fromPrd>' , fromPrd);
    // console.log('toPrd>' , toPrd);
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_planning/filter-product-master?fromPrd=${fromPrd}&toPrd=${toPrd}`);
      const data  = response.data;
      setDistinctProductMaster(data);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };
  const handleClear = () => {
    setDistinctProductMaster([]);
    setSelectedFromProduct(null);
    setSelectedToProduct(null);
  };
  const handleExportToExcel = async () => {
    if (distinctProductMaster.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning !',
          text: 'No data available to export.',
          confirmButtonColor: '#4E71FF',
        });
        return;
    }
    // const formattedDateTime = `${year}${month}${date}${now.getHours()}${now.getMinutes()}`;

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ProductMasterReport');

    // Define headers
    const headers = [
        'No', 'Product', 'Category', 'Item', 'Status', 'Exp. Width', 'Exp. Lenght', 'Cut Width', 'Cut Lenght',
        'Sheet/Lot', 'Pcs/Sheet', 'Pcs/Lot', 'Yields (%)', 'Price', 'Currency', 'Price Remark',
    ];

    // Add headers to the worksheet
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;

    const headerStyle = {
      border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
      },
      fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DCE6F1' } // Light blue fill DCE6F1
      },
      font: {
          name: 'Calibri',
          size: 8,
          bold: true,
          color: { argb: '000000' },
      },
      alignment: {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
      }
    };

    headerRow.eachCell((cell, colNumber) => {
      cell.border = headerStyle.border;
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;

      if (colNumber === 1) {
        worksheet.getColumn(colNumber).width = 5; // DETAILS column
      } else if (colNumber === 2 || colNumber === 4) {
        worksheet.getColumn(colNumber).width = 15; // DETAILS column
      } else if (colNumber === 16) {
        worksheet.getColumn(colNumber).width = 50; // DETAILS column
      } else  {
        worksheet.getColumn(colNumber).width = 8; // DETAILS column
      }
    });

    distinctProductMaster.forEach((agg_Row, index) => {
      const row = [
        index + 1, 
        agg_Row.product || "", 
        agg_Row.category || "", 
        agg_Row.item || "", 
        agg_Row.status || "",
        // agg_Row.ecn_details || "",
        agg_Row.exp_width || "",
        agg_Row.exp_lenght || "",
        agg_Row.cut_width || "",
        agg_Row.cut_lenght || "",
        agg_Row.sheet_lot || "",
        agg_Row.pcs_sheet || "",
        agg_Row.pcs_lot || "",
        agg_Row.yields || "",
        agg_Row.price || "",
        agg_Row.currency || "",
        agg_Row.price_remark || ""
      ];
    
      const excelRow = worksheet.addRow(row);
    
      const centerColumns = [1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
      centerColumns.forEach(colIndex => {
        excelRow.getCell(colIndex).alignment = { horizontal: 'center', vertical: 'middle' };
      });
      // const fillColor = index % 2 === 0 ? 'D9D9D9' : 'FFFFFF';
    
      // Loop over each cell in the row
      excelRow.eachCell((cell, colNumber) => {
        cell.font = {
          name: 'Calibri',
          size: 8
        };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // cell.fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        //   fgColor: { argb: fillColor }
        // };
      });
    });
    // Save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const formattedDateTime = year + month + date;
    saveAs(blob, `ProductMasterReport_${formattedDateTime}.xlsx`);
  };

  return (
    <>
      <div className="background-container">
          <Box>
            <Nav/>
            <div>
              <h5
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#006769",
                  width: "500px",
                  paddingLeft: "5px",
                  marginBottom: "20px",
                  // border: '1px solid black',
                  // backgroundColor: '#CAE6B2',
                }}
              >
                Product Master Report
              </h5>
            </div>
            <div style={{width: 1050 , display: "flex", flexDirection: "row",}}>
                {/* <label htmlFor="">From Product :</label> */}
                <Autocomplete
                  disablePortal
                  // freeSolo
                  id="combo-box-demo-product"
                  size="small"
                  options={distinctProduct}
                  getOptionLabel={(option) => option && option.prd_name}
                  value={selectedFromProduct}
                  onChange={handleFromProductChange}
                  sx={{ width: 230, height: 50 }}
                  renderInput={(params) => (
                    <TextField {...params} label="From Product" />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option && value && option.prd_name === value.prd_name
                  }
                />
                <Autocomplete
                  disablePortal
                  // freeSolo
                  id="combo-box-demo-product"
                  size="small"
                  options={distinctProduct}
                  getOptionLabel={(option) => option && option.prd_name}
                  value={selectedToProduct}
                  onChange={handleToProductChange}
                  sx={{ width: 230, height: 50, marginLeft: 2, }}
                  renderInput={(params) => (
                    <TextField {...params} label="To Product" />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option && value && option.prd_name === value.prd_name
                  }
                />
                <Button 
                    variant="contained" 
                    className="btn_hover"
                    // size="small"
                    style={{width: '120px', height: '40px' , marginLeft: '20px', borderRadius: 10, boxShadow: '3px 3px 5px grey'}}
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    >Search
                </Button>
                <Button 
                    className="btn_hover" 
                    variant="contained" 
                    startIcon={<CancelIcon />} 
                    onClick={handleClear} 
                    style={{backgroundColor: 'orange', color:'black', width: '120px', height: '40px' , marginLeft: '10px', borderRadius: 10, boxShadow: '3px 3px 5px grey'}}>
                    Cancel 
                </Button>
                <Button 
                    className="btn_hover" 
                    variant="contained" 
                    startIcon={<TableChartIcon />} 
                    onClick={handleExportToExcel} 
                    style={{backgroundColor: 'green', color:'white', width: '130px', height: '40px' , marginLeft: '10px', borderRadius: 10, boxShadow: '3px 3px 5px grey'}}>
                    To Excel 
                </Button>
            </div>
            <div style={{border: '1px solid black', width: 1830, height: 650, overflowY: 'auto', overflowX: 'hidden', marginTop: 5}}>
              {isLoading ? (
                  <Custom_Progress />
              ) : (
                  <table style={{width: 1800, borderCollapse: 'collapse',}}>
                    <thead style={{fontSize: 15, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
                      <tr>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "40px",
                                border: 'solid black 1px',
                                }}
                          >
                            No.
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "140px",
                                border: 'solid black 1px',
                                }}
                          >
                            PRODUCT
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "40px",
                                border: 'solid black 1px',
                                }}
                          >
                            CATEGORY
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "140px",
                                border: 'solid black 1px',
                                }}
                          >
                            ITEM
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "80px",
                                border: 'solid black 1px',
                                }}
                          >
                            STATUS
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           EXP. WIDTH
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           EXP. LENGHT
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           CUT WIDTH
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           CUT LENGHT
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           SHT/LOT
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           PCS/SHT
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           PCS/LOT
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           YIELDS(%)
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           PRICE
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "60px",
                                border: 'solid black 1px',
                                }}
                          >
                           CURRENCY
                        </th>
                        <th
                          style={{
                                textAlign: "center",
                                backgroundColor: "#AED2FF",
                                height: "45px",
                                width: "120px",
                                border: 'solid black 1px',
                                }}
                          >
                           PRICE REMARK
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: 14, textAlign: 'center' }}>
                     {distinctProductMaster.map((item, index) => (
                        <tr key={index}>
                          <td style={{
                              border: 'solid black 1px',
                              textAlign: 'center',
                              height: "30px",
                            }}>
                              {index + 1}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'left',
                                        height: "30px",
                                        paddingLeft: 10,
                                      }}
                                >
                                {item.product || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.category || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'left',
                                        paddingLeft: 10,
                                      }}
                                >
                                {item.item || ""}
                            </td>
                            <td style={{border: 'solid black 1px',
                                      }}
                                >
                                {item.status || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.exp_width || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.exp_lenght || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.cut_width || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.cut_lenght || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.sheet_lot || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.pcs_sheet || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.pcs_lot || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.yields || ""}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.price || 0}
                            </td>
                            <td style={{border: 'solid black 1px', 
                                        textAlign: 'center',
                                      }}
                                >
                                {item.currency || ""}
                            </td>
                            <td style={{
                                        border: 'solid black 1px', 
                                        textAlign: 'left',
                                        paddingLeft: 10, 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        maxWidth: '120px' ,
                                        cursor: item.price_remark ? "pointer" : "default" ,
                                      }}
                                onMouseDown={(e) => e.currentTarget.style.whiteSpace = "normal"}
                                onMouseUp={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                                onMouseLeave={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                                >
                                {item.price_remark || ""}
                            </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              )}
            </div>
            
          </Box>
      </div>
    </>
  );
}