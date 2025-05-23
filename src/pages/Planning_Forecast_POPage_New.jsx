// import * as React from 'react';
import { useState, useEffect } from "react";
import SearchFacSeriesProd_Fc from "../components/SearchGroup/SearchFacSeriesProd_Fc";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
// import { isNull } from "lodash";
import Nav from "../components/Nav";
import "./styles/Planning_Forecast_POPage.css";
import Container from "@mui/material/Container";

// import { Container } from "@mui/material";

export default function Planning_Forecast_POPage_New({ onSearch }) {
  const getJson = (apiRef) => {
    // Select rows and columns
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

    // Format the data. Here we only keep the value
    const data = filteredSortedRowIds.map((id) => {
      const row = {};
      visibleColumnsField.forEach((field) => {
        row[field] = apiRef.current.getCellParams(id, field).value;
      });
      return row;
    });

    // Stringify with some indentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
    return JSON.stringify(data, null, 2);
  };

  const exportBlob = (blob, filename) => {
    // Save the blob in a json file
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    });
  };

  function JsonExportMenuItem(props) {
    const apiRef = useGridApiContext();
    const { hideMenu } = props;

    return (
      <MenuItem
        onClick={() => {
          const jsonString = getJson(apiRef);
          const blob = new Blob([jsonString], {
            type: "text/json",
          });
          exportBlob(blob, "DataGrid_demo.json");

          // Hide the export menu after the export
          hideMenu?.();
        }}
      >
        Export JSON
      </MenuItem>
    );
  }
  const csvOptions = { delimiter: "," };

  function CustomExportButton(props) {
    return (
      <GridToolbarExportContainer {...props}>
        <GridCsvExportMenuItem options={csvOptions} />
        <JsonExportMenuItem />
      </GridToolbarExportContainer>
    );
  }

  function CustomToolbar(props) {
    return (
      <GridToolbarContainer {...props}>
        <CustomExportButton />
      </GridToolbarContainer>
    );
  }

  // For Select Data //
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [runningNumber, setRunningNumber] = useState(1); //use for table
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedPoBal, setSelectedPoBal] = useState(null);
  const [selectedFgDet, setSelectedFgDet] = useState(null);
  const [selectedFgunDet, setSelectedFgunDet] = useState(null);
  const [selectedWipPenDet, setSelectedWipPenDet] = useState(null);
  const [selectedWipDet, setSelectedWipDet] = useState(null);
  const [selectedWipBookingDet, setSelectedWipBookingDet] = useState(null);

  const [IndexWeek, setIndexWeek] = useState([0]);
  const [WidthShowPD, setWidthShowPD] = useState([0]);

  // For Fetch Data //
  const [wk_no, setWeekNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [po_alls, setPo_All] = useState([]);
  const [po_rec, setPoRec] = useState([]);
  const [po_due, setPoDue] = useState([]);
  const [poBalData, setPoBalData] = useState(
    Array.from({ length: wk_no.length }, () => "0")
  );
  const [Fg, setFg] = useState([]);
  const [wip, setWip] = useState([]);
  const [monDate, setMonDate] = useState([]);
  const [actualShips, setActualShips] = useState([]);
  const [pdShow, setpdShow] = useState([]);
  const [fetchedProductData, setFetchedProductData] = useState([]);
  const [fcFlatData, setFcFlatData] = useState([]);
  const [wipPending, setWipPending] = useState([]);
  const [FgUnmovement, setFgUnmovement] = useState([]);
  const [fcAccuracy, setfcAccuracy] = useState([]);
  const [fcLatest, setfcLatest] = useState([]);
  const [WipBooking, setWipBooking] = useState([]);

  // For Modal //
  const [isModalOpen_PODet, setIsModalOpen_PODet] = useState(false);
  const [poBalDetails, setpoBalDetails] = useState([]);
  //
  const [isModalOpen_FGDet, setIsModalOpen_FGDet] = useState(false);
  const [FGDetails, setFGDetails] = useState([]);
  //
  const [isModalOpen_FGunDet, setIsModalOpen_FGunDet] = useState(false);
  const [FGunDetails, setFGunDetails] = useState([]);
  //
  const [isModalOpen_WipPenDet, setIsModalOpen_WipPenDet] = useState(false);
  const [WipPenDetails, setWipPenDetails] = useState([]);
  //
  const [isModalOpen_WipDet, setIsModalOpen_WipDet] = useState(false);
  const [WipDetails, setWipDetails] = useState([]);
  
  const [isModalOpen_WipBookingDet, setIsModalOpen_WipBookingDet] = useState(false);
  const [WipBookingDetail, setWipBookingDetail] = useState([]);


  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Update 48_Week Completed //
  const fetchData_week = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/get-week?week=${selectedWeek}`
      );
      const wk_no = await response.data;
      const weekNumbers = wk_no.map((weekObj) => weekObj.wk);
      const mon_date = wk_no.map((weekObj) => weekObj.mon_date);

      setWeekNumbers(weekNumbers);
      setMonDate(mon_date);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError('An error occurred while fetching data week');
      setError(`An error occurred while fetching data week: ${error.message}`);
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_fc = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fc-by-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}&week=${selectedWeek}`
      );
      const data = await response.data;
      setProducts(data);
      setRunningNumber(1); // Reset the running number to 1
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Forecast");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_po = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-po-all-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}&week=${selectedWeek}`
      );
      const data = await response.data;

      const poRecData = {};
      data.forEach((item) => {
        poRecData[item.wk] = item.qty_rec;
      });

      const poDueData = {};
      data.forEach((item) => {
        poDueData[item.wk] = item.qty_due;
      });

      const FgData = {};
      data.forEach((item) => {
        FgData[item.wk] = item.qty_fg;
      });

      const WipData = {};
      data.forEach((item) => {
        WipData[item.wk] = item.qty_wip;
      });

      setPo_All(data);
      setPoRec(poRecData);
      setPoDue(poDueData);
      setFg(FgData);
      setWip(WipData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Po_All");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_ActualShip = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-actual-ship-summary-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}&week=${selectedWeek}`
      );
     
      const data = await response.data;
      const ActualData = {};
      data.forEach((item) => {
        ActualData[item.wk] = item.qty_ship;
      });
      setActualShips(ActualData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Actual ship Summary");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const fetchData_PDshow = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-show-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
    
      const data = await response.data;
      setpdShow(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data product show");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_FcFlat = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fc-diff-prev-curr?prd_series=${prd_series}&prd_name=${prd_name}&week=${selectedWeek}`
      );
     
      const data = await response.data;
      const FlatData = {};
      data.forEach((item) => {
        FlatData[item.wk] = item.qty_fc;
      });
      setFcFlatData(FlatData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data FC_FLAT");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const [sumQtyBal, setSumQtyBal] = useState(0);
  const fetchData_poBalDetail = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      //   setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-po-bal-detail-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
 
      const data = await response.data;
      setpoBalDetails(data); // Update the state variable name
      const sum = data.reduce((total, item) => total + item.qty_bal, 0);
      setSumQtyBal(sum);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Po Bal Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_WipPending = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      //   setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-wip-pending-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
  
      const data = await response.data;
      const wipPendingData = {};
      data.forEach((item) => {
        wipPendingData[item.wk] = item.qty_pending;
      });
      setWipPending(data); // Update the state variable name
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Wip Pending");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_Fgunmovement = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      //   setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fg-unmovement-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
   
      const data = await response.data;
      const fgUnmovementData = {};
      data.forEach((item) => {
        fgUnmovementData[item.wk] = item.qty_hold;
      });
      setFgUnmovement(fgUnmovementData); // Update the state variable name
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data FG Unmovement");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const [sumQtyFg, setsumQtyFg] = useState(0);
  const fetchData_FGDetails = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fg-details-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
     
      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      setFGDetails(rowsWithId);
      const sum = data.reduce((total, item) => total + item.qty_good, 0);
      setsumQtyFg(sum);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data FG Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_FGunDetails = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fg-unmovement-details-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
    
      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      setFGunDetails(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data FG Unmovement Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_WipPenDetails = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-wip-pending-detail-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
   
      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      setWipPenDetails(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Wip Pending Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const [sumQtyWip, setsumQtyWip] = useState(0);
  const fetchData_WipDetails = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-wip-detail-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
     
      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      setWipDetails(rowsWithId);
      const sum = data.reduce((total, item) => total + item.qty_wip_detail, 0);
      setsumQtyWip(sum);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data Wip Details");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_fc_accuracy = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fc-accuracy-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
    
      const data = await response.data;
      // console.log(data);
      const fcAccuracyData = {};
      data.forEach((item) => {
        fcAccuracyData[item.wk] = item.fc_accuracy;
      });
      // console.log(fcAccuracyData);
      setfcAccuracy(fcAccuracyData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data accuracy");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_fc_latest = async (
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-fc-latest-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}&week=${selectedWeek}`
      );
    
      const data = await response.data;
      // console.log(data);
      const fcLatestData = {};
      data.forEach((item) => {
        fcLatestData[item.wk] = item.qty_fc;
      });
      // console.log(fcLatestData);
      setfcLatest(fcLatestData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data accuracy");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_wip_booking = async ( 
    prd_name = selectedProduct,
    prd_series = selectedSeries
  ) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-data-wip-booking-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}`
      );
      const data = await response.data;
      console.log("data >" , data);

      const WipBookingData = {};
      data.forEach((item) => {
        WipBookingData[item.wk] = item.wip_booking;
      });
      // console.log(WipBookingData);
      setWipBooking(WipBookingData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data accuracy");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // Update 48_Week Completed //
  const fetchData_wip_booking_details = async (week) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-data-wip-booking-details-product-series?prd_series=${selectedSeries}&prd_name=${selectedProduct}&week=${week}`
      );
      const data = await response.data;
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, // You can use a better unique identifier here if available
      }));
      // setWipPenDetails(rowsWithId);
      console.log("Details >" , rowsWithId);
      setWipBookingDetail(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data accuracy");
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  

  useEffect(() => {
    //ต้องมี userEffect เพื่อให้รับค่าจาก อีก component ได้ต่อเนื่อง realtime หากไม่มีจะต้องกดปุ่ม 2 รอบ
    if (selectedWeek === "24_wk") {
      setIndexWeek(12)
      setWidthShowPD(1595)
    } else if (selectedWeek === "48_wk") {
      setIndexWeek(24)
      setWidthShowPD(3260)
    }

    if (selectedWeek === null) {
    } else {
      fetchData_week(); // OK
      fetchData_fc(); // OK
      fetchData_fc_latest(); // OK
      fetchData_FcFlat(); // OK
      fetchData_fc_accuracy(); // OK
      fetchData_po(); // OK
      fetchData_ActualShip(); // OK
      fetchData_wip_booking(); // OK
      fetchData_poBalDetail(); // OK
      fetchData_FGDetails(); // OK
      fetchData_Fgunmovement(); // OK
      fetchData_FGunDetails(); // OK
      fetchData_WipDetails(); // OK
      fetchData_WipPending(); // OK
      fetchData_WipPenDetails(); // OK

      if (selectedProduct === null) {
      } else {
        fetchData_PDshow();
      }
    }
  }, [selectedProduct, selectedSeries , selectedWeek]);
  // console.log("Product" , selectedProduct);

  useEffect(() => {
    const prdNames = pdShow.map((item) => item.prd_name);
    if (prdNames.length === 0) {
      setFetchedProductData("");
    } else {
      setFetchedProductData(prdNames);
    }
  }, [pdShow]);

  function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const dataByProduct = {};
  products.forEach((product) => {
    if (!dataByProduct[product.pfd_period_no]) {
      dataByProduct[product.pfd_period_no] = {
        pfd_period_no: product.pfd_period_no,
        qty_fc: {},
      };
    }
    dataByProduct[product.pfd_period_no].qty_fc[product.wk] = product.qty_fc;
  });


  // Modal //
  const style_Modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
  };
  ////////////// Modal PO_Bal by Details //////////////////////////////////
  const openModal_PoBalDetails = (poBalValue) => {
    if (poBalValue > 0) {
      setSelectedPoBal(poBalValue);
      setIsModalOpen_PODet(true);
    }
  };
  const closeModal_PoBalDetails = () => {
    setSelectedPoBal(null);
    setIsModalOpen_PODet(false);
  };

  const columns_PoBalDetails = [
    { field: "prd_name", headerName: "Product Name", width: 200 },
    { field: "so_line", headerName: "SO Line", width: 200 },
    { field: "so_no", headerName: "SO Number", width: 200 },
    { field: "request_date", headerName: "Req. Date", width: 200 },
    { field: "due_date", headerName: "Due. Date", width: 200 },
    { field: "qty_bal", headerName: "Qty Bal", width: 200 },
  ];

  ////////////// Modal FG by Details //////////////////////////////////
  const openModal_FGDetails = (FgDetValue) => {
    if (FgDetValue > 0) {
      setSelectedFgDet(FgDetValue);
      setIsModalOpen_FGDet(true);
    }
  };
  const closeModal_FGDetails = () => {
    setSelectedFgDet(null);
    setIsModalOpen_FGDet(false);
  };

  const columns_FGDetails = [
    { field: "prd_name", headerName: "Product Name", width: 200 },
    { field: "prd_series", headerName: "Product Series", width: 200 },
    { field: "ld_loc", headerName: "Location", width: 200 },
    { field: "ld_status", headerName: "Status", width: 200 },
    { field: "qty_good", headerName: "Qty Good", width: 200 },
  ];

  ////////////// Modal FG Unmovement by Details //////////////////////////////////
  const openModal_FGunDetails = (FgunDetValue) => {
    if (FgunDetValue > 0) {
      setSelectedFgunDet(FgunDetValue);
      setIsModalOpen_FGunDet(true);
    }
  };
  const closeModal_FGunDetails = () => {
    setSelectedFgunDet(null);
    setIsModalOpen_FGunDet(false);
  };

  const columns_FGunDetails = [
    { field: "prd_name", headerName: "Product Name", width: 200 },
    { field: "prd_series", headerName: "Product Series", width: 200 },
    { field: "ld_loc", headerName: "Location", width: 200 },
    { field: "ld_status", headerName: "Status", width: 200 },
    { field: "qty_hold", headerName: "Qty Hold", width: 200 },
  ];

  ////////////// Modal Wip Pending by Details //////////////////////////////////
  const openModal_WipPenDetails = (WipPenDetValue) => {
    if (WipPenDetValue > 0) {
      setSelectedWipPenDet(WipPenDetValue);
      setIsModalOpen_WipPenDet(true);
    }
  };
  const closeModal_WipPenDetails = () => {
    setSelectedWipPenDet(null);
    setIsModalOpen_WipPenDet(false);
  };

  const columns_WipPenDetails = [
    { field: "prd_name", headerName: "Product Name", width: 200 },
    { field: "lot", headerName: "Lot No.", width: 200 },
    { field: "prd_series", headerName: "Product Series", width: 100 },
    { field: "factory", headerName: "Factory", width: 100 },
    { field: "unit", headerName: "Unit", width: 100 },
    { field: "process", headerName: "Process", width: 100 },
    { field: "pending_reason", headerName: "Reason", width: 200 },
    { field: "qty_pending", headerName: "Qty Pending", width: 200 },
  ];

  ////////////// Modal Wip by Details //////////////////////////////////
  const openModal_WipDetails = (WipDetValue) => {
    if (WipDetValue > 0) {
      setSelectedWipDet(WipDetValue);
      setIsModalOpen_WipDet(true);
    }
  };
  const closeModal_WipDetails = () => {
    setSelectedWipDet(null);
    setIsModalOpen_WipDet(false);
  };

  const columns_WipDetails = [
    { field: "prd_name", headerName: "Product Name", width: 200 },
    { field: "prd_series", headerName: "Product Series", width: 200 },
    { field: "factory", headerName: "Factory", width: 200 },
    { field: "unit", headerName: "Unit", width: 200 },
    { field: "process", headerName: "Process", width: 200 },
    { field: "qty_wip_detail", headerName: "Net Qty WIP Detail", width: 200 },
    { field: "std_day", headerName: "Remain to WH(Days)", width: 150 },
  ];

  ////////////// Modal Wip booking plan by Details //////////////////////////////////
  const openModal_WipBookingDetails = (WipBookingDetValue) => {
    if (WipBookingDetValue > 0) {
      setSelectedWipBookingDet(WipBookingDetValue);
      setIsModalOpen_WipBookingDet(true);
    }
  };
  const closeModal_WipBookingDetails = () => {
    setSelectedWipBookingDet(null);
    setIsModalOpen_WipBookingDet(false);
  };

  const columns_WipBookingDetails = [
    { field: "prd_name", headerName: "Product Name", width: 170 },
    { field: "prd_series", headerName: "Product Series", width: 150 },
    { field: "lot", headerName: "Lot No.", width: 160 },
    { field: "factory", headerName: "Factory", width: 120 },
    { field: "unit", headerName: "Unit", width: 120 },
    { field: "process", headerName: "Process", width: 120 },
    { field: "ro_rev", headerName: "Revision", width: 120 },
    { field: "qty_wip_detail", headerName: "QTY WIP Booking", width: 155 },
    { field: "lot_sch_effdat", headerName: "Eff. Date", width: 110 },
  ];

  let result_1 = sumQtyBal;
  let result_2,
    result_3,
    result_4,
    result_5,
    result_6,
    result_7,
    result_8,
    result_9,
    result_10,
    result_11 = 0;
    
  // const exportToCSV = () => {
  //   const csvContent = "data:text/csv;charset=utf-8," +
  //     "Week," + wk_no.join(",") + "\n" +
  //     "Date," + monDate.join(",") + "\n" +
  //               products.join(",");
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "export.csv");
  //   document.body.appendChild(link);
  //   link.click();
  // };

  const exportToCSV = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${year}${month}${date}${hours}${minutes}${seconds}`;

    const csvContent = "data:text/csv;charset=utf-8," +
      // Constructing CSV content
      "Week," + wk_no.join(",") + "\n" +
      "Date," + monDate.join(",") + "\n" +
      Object.values(dataByProduct).map((productData) => {
        const row = [
          productData.pfd_period_no,
          ...wk_no.map((week) => productData.qty_fc[week] !== undefined ? productData.qty_fc[week] : "0")
        ];
        return row.join(",");
      }).join("\n") + "\n" +
      "FC_Latest:," + wk_no.map(week => fcLatest[week] !== undefined ? fcLatest[week] : "0").join(",") + "\n" +
      "FC_Fluctuation:," + wk_no.map(week => fcFlatData[week] !== undefined ? fcFlatData[week] : "0").join(",") + "\n" +
      // "FC_Stablelability(%):," + wk_no.map(week => fcAccuracy[week] !== undefined ? fcAccuracy[week]: "0").join(",") + "\n" +
      "FC_Stablelability(%):," + wk_no.map(week => fcAccuracy[week] !== undefined ? `${fcAccuracy[week]}%` : "0%").join(",") + "\n" +
      "PO_REC:," + wk_no.map(week => po_rec[week] !== undefined ? po_rec[week]: "0").join(",") + "\n" +
      "PO_DUE:," + wk_no.map(week => po_due[week] !== undefined ? po_due[week]: "0").join(",") + "\n" +
      "Actual ship::," + wk_no.map(week => actualShips[week] !== undefined ? actualShips[week]: "0").join(",") + "\n" +
      "WIP Booking plan:," + wk_no.map(week => WipBooking[week] !== undefined ? WipBooking[week]: "0").join(",") + "\n" +
      "PO_BAL:," + wk_no.map((week, weekIndex) => weekIndex === IndexWeek ? sumQtyBal : "0").join(",") + "\n" +
      "FG:," + wk_no.map((week, weekIndex) => weekIndex === IndexWeek ? sumQtyFg : "0").join(",") + "\n" +
      "FG Unmovement:," + wk_no.map(week => FgUnmovement[week] !== undefined ? FgUnmovement[week]: "0").join(",") + "\n" +
      "WIP:," + wk_no.map((week, weekIndex) => weekIndex === IndexWeek ? sumQtyWip : "0").join(",") + "\n" +
      "WIP Pending (1.1:3.1):," + wk_no.map((week, weekIndex) => weekIndex === IndexWeek && wipPending && wipPending.length > 0 ? wipPending[0].qty_pending : "0").join(",");
    
    const fileName = `dataAnalysisForecast_${formattedDateTime}.csv`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <div className="po-container">
        <Container maxWidth="lg">
          <Box>
            <Nav />
            {/* style={{ display: 'flex', flexDirection: 'row' }} */}
            <div>
              <SearchFacSeriesProd_Fc
                onSearch={(queryParams) => {
                  setSelectedProduct(queryParams.prd_name);
                  setSelectedSeries(queryParams.prd_series);
                  setSelectedWeek(queryParams.week);
                  // fetchData_PDshow();
                }}
              />
              <div>
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      width: "150px",
                      height: "35px",
                      backgroundColor: 'green',
                      marginBottom: 10
                    }}
                    onClick={exportToCSV}
                  >
                    Export to Excel
                  </Button>
              </div>
              <div id="pdShowLabel" style={{ width:  WidthShowPD}}>
                {selectedProduct === "Product" ? (
                  <div
                    style={{
                      backgroundColor: "#E4F1FF",
                      fontSize: "14px",
                      fontFamily: "Angsana News, sans-serif",
                      color: "#952323",
                    }}
                  >
                    {selectedSeries}
                  </div> // Render an empty div if selectedProduct is "Empty"
                ) : (
                  chunkArray(fetchedProductData, 10).map((chunk, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#1679AB",
                        fontSize: "16px",
                        fontFamily: "Angsana News, sans-serif",
                        color: "white",
                      }}
                    >
                      {chunk.join(" ::: ")}
                    </div>
                  ))
                )}
              </div>
            </div>
            

            <div
              className="table-responsive_table-fullscreen"
              // style={{ height: 800, width: "100%", marginTop: "5px" }}
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
                    fontSize: "11px",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                >
                  <thead
                    className="thead-dark"
                    style={{ position: "sticky", top: "0", zIndex: "1" }}
                  >
                    {/* className="table table-hover blue-theme table-very-small" */}
                    <tr>
                      {/* <th>Row No</th> */}
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          height: "40px",
                          width: "120px",
                        }}
                      >
                        Week
                      </th>
                      {wk_no.map((week, index) => {
                        let backgroundColor = "";
                        let fontColor = "";

                        if (index < IndexWeek) {
                          backgroundColor = "#E4F1FF";
                        } else if (index > IndexWeek) {
                          backgroundColor = "#E4F1FF";
                        } else {
                          (backgroundColor = "#279EFF"),
                            (fontColor = "#F3FDE8");
                        }

                        return (
                          <th
                            key={index}
                            style={{
                              backgroundColor: backgroundColor,
                              color: fontColor,
                              textAlign: "center",
                              width: "60px",
                            }}
                          >
                            {week}
                          </th>
                        );
                      })}
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          height: "40px",
                        }}
                      >
                        Period No. / Date
                      </th>
                      {monDate.map((date, index) => {
                        let backgroundColor = "";
                        let fontColor = "";

                        if (index < IndexWeek) {
                          backgroundColor = "#E4F1FF";
                        } else if (index > IndexWeek) {
                          backgroundColor = "#E4F1FF";
                        } else {
                          (backgroundColor = "#279EFF"),
                            (fontColor = "#F3FDE8");
                        }

                        return (
                          <th
                            key={index}
                            style={{
                              backgroundColor: backgroundColor,
                              color: fontColor,
                              textAlign: "center",
                            }}
                          >
                            {date}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(dataByProduct).map((productData, index) => (
                      <tr key={productData.pfd_period_no}>
                        <td
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {productData.pfd_period_no}
                        </td>
                        {wk_no.map((week, weekIndex) => {
                          let backgroundColor = "white"; // Default background color
                          let fontColor_wk = "";
                          const Period4Chars =
                            productData.pfd_period_no.slice(-4);
                          const Week4Chars = week.slice(-4);

                          if (weekIndex === IndexWeek ) {
                            backgroundColor = "#CEE6F3";
                            fontColor_wk = "#0E21A0";
                          } else if (Period4Chars === Week4Chars) {
                            backgroundColor = "#B9B4C7"; // Set background color to your desired color if weekIndex is 12
                          }

                          const totalRows = Object.values(dataByProduct).length;
                          // let previousResult = 0;
                          let qtyFc =
                            productData.qty_fc[week] !== undefined
                              ? productData.qty_fc[week]
                              : 0;
                          // let result = productData.qty_fc[week] !== undefined ? sumQtyBal - productData.qty_fc[week] : 0;
                          if (index === totalRows - 1) {
                            // Apply conditions only to the last row
                            if (weekIndex === (IndexWeek)) {
                              result_1 = result_1 - qtyFc;
                              if (result_1 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_1 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }
                            if (weekIndex === (IndexWeek + 1)) {
                              result_2 = result_1 - qtyFc;
                              if (result_2 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_2 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 2)) {
                              result_3 = result_2 - qtyFc;
                              if (result_3 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_3 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 3)) {
                              result_4 = result_3 - qtyFc;
                              if (result_4 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_4 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 4)) {
                              result_5 = result_4 - qtyFc;
                              if (result_5 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_5 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 5)) {
                              result_6 = result_5 - qtyFc;
                              if (result_6 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_6 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 6)) {
                              result_7 = result_6 - qtyFc;
                              if (result_7 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_7 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 7)) {
                              result_8 = result_7 - qtyFc;
                              if (result_8 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_8 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 8)) {
                              result_9 = result_8 - qtyFc;
                              if (result_9 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_9 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 9)) {
                              result_10 = result_9 - qtyFc;
                              if (result_10 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_10 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }

                            if (weekIndex === (IndexWeek + 10)) {
                              result_11 = result_10 - qtyFc;
                              if (result_11 >= 0) {
                                backgroundColor = "#A6FF96";
                              } else if (result_11 < 0) {
                                backgroundColor = "#EF9595";
                              }
                            }
                          }

                          return (
                            <td
                              key={weekIndex}
                              style={{
                                textAlign: "center",
                                backgroundColor: backgroundColor,
                                color: fontColor_wk,
                                height: "30px",
                              }}
                            >
                              {productData.qty_fc[week] !== undefined
                                ? formatNumberWithCommas(
                                    productData.qty_fc[week]
                                  )
                                : "0"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        FC_Latest :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const fcLatestDataValue = fcLatest[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                            }}
                          >
                            {fcLatestDataValue !== undefined
                              ? formatNumberWithCommas(fcLatestDataValue)
                              : "0"}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#AED2FF",
                          height: "30px",
                        }}
                      >
                        FC_Fluctuation :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const FlatValue = fcFlatData[week];
                        const isNegative =
                          FlatValue && FlatValue.charAt(0) === "-";
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#AED2FF",
                              color: isNegative
                                ? "red"
                                : weekIndex === IndexWeek
                                ? "#0E21A0"
                                : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                            }}
                          >
                            {FlatValue !== undefined
                              ? formatNumberWithCommas(FlatValue)
                              : "0"}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        FC_Stablelability(%) :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const fcAccuracyValue = fcAccuracy[week];
                        const fcAccuracyValues =
                          fcAccuracyValue !== undefined
                            ? parseInt(fcAccuracyValue)
                            : "-";
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                            }}
                          >
                            {/* {fcAccuracyValues !== undefined ? formatNumberWithCommas(fcAccuracyValues) + "" : "-"} */}
                            {fcAccuracyValues !== undefined
                              ? `${formatNumberWithCommas(fcAccuracyValues)}${
                                  fcAccuracyValues > 0 ? " %" : ""
                                }`
                              : "-"}

                            {/* {fcAccuracyValues !== undefined ? `${formatNumberWithCommas(fcAccuracyValues)} %` : "0 %"} */}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#AED2FF",
                          height: "30px",
                        }}
                      >
                        PO_REC :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const recValue = po_rec[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#AED2FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                            }}
                          >
                            {recValue !== undefined
                              ? formatNumberWithCommas(recValue)
                              : "0"}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        PO_DUE :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const dueValue = po_due[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                            }}
                          >
                            {dueValue !== undefined
                              ? formatNumberWithCommas(dueValue)
                              : "0"}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#AED2FF",
                          height: "30px",
                        }}
                      >
                        Actual ship :
                      </td>
                      {wk_no.map((week, weekIndex) => (
                        <td
                          key={weekIndex}
                          style={{
                            textAlign: "center",
                            backgroundColor: "#AED2FF",
                            color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                            fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                          }}
                        >
                          {actualShips[week] !== undefined
                            ? formatNumberWithCommas(actualShips[week])
                            : "0"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        WIP Booking plan :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const WipBookingValue = WipBooking[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              cursor:
                                WipBookingValue > 0
                                  ? "pointer"
                                  : "default",
                              textDecoration:
                                WipBookingValue > 0
                                  ? "underline"
                                  : "none",
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: WipBookingValue > 0 ? "#0E21A0" : "black",
                              fontWeight: WipBookingValue > 0 ? "bold" : "normal",
                              fontSize: WipBookingValue > 0 ? "12px" : "normal",
                            }}
                            onClick={() => {
                              if (WipBookingValue > 0) {
                                fetchData_wip_booking_details(week);
                                
                                openModal_WipBookingDetails(WipBookingValue);
                                console.log("WEEK >" , week);
                              }
                            }} // Open modal on click
                          >
                            {WipBookingValue !== undefined
                              ? formatNumberWithCommas(WipBookingValue)
                              : "0"}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                            
                          </td>
                        );
                        
                      })}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        PO_BAL :
                      </td>
                      {wk_no.map((week, weekIndex) => (
                        <td
                          key={weekIndex}
                          style={{
                            cursor:
                              weekIndex === IndexWeek && sumQtyBal > 0
                                ? "pointer"
                                : "default",
                            textDecoration:
                              weekIndex === IndexWeek && sumQtyBal > 0
                                ? "underline"
                                : "none",
                            textAlign: "center",
                            backgroundColor: "#E4F1FF",
                            color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                            fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                            fontSize: weekIndex === IndexWeek ? "12px" : "normal",
                          }}
                          // onClick={() => openModal_PoBalDetails(sumQtyBal)}
                          onClick={() => {
                            if (weekIndex === IndexWeek && sumQtyBal > 0) {
                              openModal_PoBalDetails(sumQtyBal);
                            }
                          }} // Open modal on click
                        >
                          {/* {poBalData[week] !== undefined ? formatNumberWithCommas(poBalData[week]) : "0"} */}
                          {weekIndex === IndexWeek  
                            ? formatNumberWithCommas(sumQtyBal)
                            : "0"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        FG :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const FgValue = Fg[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              cursor:
                                weekIndex === IndexWeek && sumQtyFg > 0
                                  ? "pointer"
                                  : "default",
                              textDecoration:
                                weekIndex === IndexWeek && sumQtyFg > 0
                                  ? "underline"
                                  : "none",
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                              fontSize: weekIndex === IndexWeek ? "12px" : "normal",
                            }}
                            // onClick={() => openModal_FGDetails(sumQtyFg)}
                            onClick={() => {
                              if (weekIndex === IndexWeek && sumQtyFg > 0) {
                                openModal_FGDetails(sumQtyFg);
                              }
                            }} // Open modal on click
                          >
                            {weekIndex === IndexWeek
                              ? formatNumberWithCommas(sumQtyFg)
                              : "0"}
                            {/* {FgValue !== undefined ? formatNumberWithCommas(FgValue) : "0"} */}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        FG Unmovement :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const FgUnmovementValue = FgUnmovement[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              cursor:
                                weekIndex === IndexWeek && FgUnmovement[week] > 0
                                  ? "pointer"
                                  : "default",
                              textDecoration:
                                weekIndex === IndexWeek && FgUnmovement[week] > 0
                                  ? "underline"
                                  : "none",
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                              fontSize: weekIndex === IndexWeek ? "12px" : "normal",
                            }}
                            // onClick={() => openModal_FGunDetails(FgUnmovement[week])}
                            onClick={() => {
                              if (weekIndex === IndexWeek && FgUnmovement[week] > 0) {
                                openModal_FGunDetails(FgUnmovement[week]);
                              }
                            }} // Open modal on click
                          >
                            {FgUnmovementValue !== undefined
                              ? formatNumberWithCommas(FgUnmovementValue)
                              : "0"}
                            {/* {recValue !== undefined ? (recValue !== 0 ? recValue : "--") : "--"} */}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        WIP :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        const WipValue = wip[week];
                        return (
                          <td
                            key={weekIndex}
                            style={{
                              cursor:
                                weekIndex === IndexWeek && sumQtyWip > 0
                                  ? "pointer"
                                  : "default",
                              textDecoration:
                                weekIndex === IndexWeek && sumQtyWip > 0
                                  ? "underline"
                                  : "none",
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                              fontSize: weekIndex === IndexWeek ? "12px" : "normal",
                            }}
                            // onClick={() => openModal_WipDetails(sumQtyWip)}
                            onClick={() => {
                              if (weekIndex === IndexWeek && sumQtyWip > 0) {
                                openModal_WipDetails(sumQtyWip);
                              }
                            }} // Open modal on click
                          >
                            {weekIndex === IndexWeek
                              ? formatNumberWithCommas(sumQtyWip)
                              : "0"}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {/* <td></td> */}
                      <td
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          textAlign: "right",
                          backgroundColor: "#E4F1FF",
                          height: "30px",
                        }}
                      >
                        WIP Pending (1.1,3.1) :
                      </td>
                      {wk_no.map((week, weekIndex) => {
                        return (
                          <th
                            key={weekIndex}
                            style={{
                              cursor:
                                weekIndex === IndexWeek &&
                                wipPending &&
                                wipPending.length > 0
                                  ? "pointer"
                                  : "default",
                              textDecoration:
                                weekIndex === IndexWeek &&
                                wipPending &&
                                wipPending.length > 0
                                  ? "underline"
                                  : "none",
                              textAlign: "center",
                              backgroundColor: "#E4F1FF",
                              color: weekIndex === IndexWeek ? "#0E21A0" : "black",
                              fontWeight: weekIndex === IndexWeek ? "bold" : "normal",
                              fontSize: weekIndex === IndexWeek ? "12px" : "normal",
                            }}
                            // onClick={() => openModal_WipPenDetails(wipPending.length)}
                            onClick={() => {
                              if (weekIndex === IndexWeek && wipPending.length > 0) {
                                openModal_WipPenDetails(wipPending.length);
                              }
                            }} // Open modal on click
                          >
                            {wipPending &&
                            wipPending.length > 0 &&
                            weekIndex === IndexWeek
                              ? formatNumberWithCommas(
                                  wipPending[0].qty_pending
                                )
                              : "0"}
                          </th>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Modal */}
              {isModalOpen_PODet && (
                <Modal
                  open={isModalOpen_PODet}
                  onClose={closeModal_PoBalDetails}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1325,
                      height: 800,
                      backgroundColor: "#AED2FF",
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
                        <label htmlFor="">PO Balance by Details</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_PoBalDetails}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <DataGrid
                        // rows={poBalDetails}
                        rows={poBalDetails.map((row) => ({
                          ...row,
                          qty_bal: formatNumberWithCommas(row.qty_bal), // Format the qty_pending field
                        }))}
                        columns={columns_PoBalDetails}
                        loading={!poBalDetails.length}
                        pageSize={10}
                        checkboxSelection
                        // autoPageSize
                        style={{
                          minHeight: "400px",
                          border: "1px solid black",
                          backgroundColor: "#E4F1FF",
                        }}
                        slots={{ toolbar: CustomToolbar }}
                      />
                    </div>
                  </Box>
                </Modal>
              )}

              {isModalOpen_FGDet && (
                <Modal
                  open={isModalOpen_FGDet}
                  onClose={closeModal_FGDetails}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1120,
                      height: 800,
                      backgroundColor: "#AED2FF",
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
                        <label htmlFor="">FG by Details</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_FGDetails}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <DataGrid
                        // rows={FGDetails}
                        rows={FGDetails.map((row) => ({
                          ...row,
                          qty_good: formatNumberWithCommas(row.qty_good), // Format the qty_pending field
                        }))}
                        columns={columns_FGDetails}
                        // loading={!FGDetails.length}
                        pageSize={10}
                        checkboxSelection
                        // autoPageSize
                        style={{
                          minHeight: "400px",
                          border: "1px solid black",
                          backgroundColor: "#E4F1FF",
                        }}
                        slots={{ toolbar: CustomToolbar }}
                      />
                    </div>
                  </Box>
                </Modal>
              )}

              {isModalOpen_FGunDet && (
                <Modal
                  open={isModalOpen_FGunDet}
                  onClose={closeModal_FGunDetails}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1120,
                      height: 800,
                      backgroundColor: "#AED2FF",
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
                        <label htmlFor="">FG Unmovement by Details</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_FGunDetails}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <DataGrid
                        // rows={FGunDetails}
                        rows={FGunDetails.map((row) => ({
                          ...row,
                          qty_hold: formatNumberWithCommas(row.qty_hold), // Format the qty_pending field
                        }))}
                        columns={columns_FGunDetails}
                        // loading={!FGDetails.length}
                        pageSize={10}
                        checkboxSelection
                        // autoPageSize
                        style={{
                          minHeight: "400px",
                          border: "1px solid black",
                          backgroundColor: "#E4F1FF",
                        }}
                        slots={{ toolbar: CustomToolbar }}
                      />
                    </div>
                  </Box>
                </Modal>
              )}

              {isModalOpen_WipDet && (
                <Modal
                  open={isModalOpen_WipDet}
                  onClose={closeModal_WipDetails}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1490,
                      height: 800,
                      backgroundColor: "#AED2FF",
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
                        <label htmlFor="">WIP by Details</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_WipDetails}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <DataGrid
                        // rows={WipDetails}
                        rows={WipDetails.map((row) => ({
                          ...row,
                          qty_wip_detail: formatNumberWithCommas(
                            row.qty_wip_detail
                          ), // Format the qty_pending field
                        }))}
                        columns={columns_WipDetails}
                        // loading={!FGDetails.length}
                        pageSize={10}
                        checkboxSelection
                        // autoPageSize
                        style={{
                          minHeight: "400px",
                          border: "1px solid black",
                          backgroundColor: "#E4F1FF",
                        }}
                        slots={{ toolbar: CustomToolbar }}
                      />
                    </div>
                  </Box>
                </Modal>
              )}

              {isModalOpen_WipPenDet && (
                <Modal
                  open={isModalOpen_WipPenDet}
                  onClose={closeModal_WipPenDetails}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1330,
                      height: 800,
                      backgroundColor: "#AED2FF",
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
                        <label htmlFor="">WIP Pending by Details</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_WipPenDetails}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <DataGrid
                        // rows={WipPenDetails}
                        rows={WipPenDetails.map((row) => ({
                          ...row,
                          qty_pending: formatNumberWithCommas(row.qty_pending), // Format the qty_pending field
                        }))}
                        columns={columns_WipPenDetails}
                        // loading={!FGDetails.length}
                        pageSize={10}
                        checkboxSelection
                        // autoPageSize
                        style={{
                          minHeight: "400px",
                          border: "1px solid black",
                          backgroundColor: "#E4F1FF",
                        }}
                        slots={{ toolbar: CustomToolbar }}
                      />
                    </div>
                  </Box>
                </Modal>
              )}

              {isModalOpen_WipBookingDet && (
                <Modal
                  open={isModalOpen_WipBookingDet}
                  onClose={closeModal_WipBookingDetails}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{
                      ...style_Modal,
                      width: 1280,
                      height: 800,
                      backgroundColor: "#AED2FF",
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
                        <label htmlFor="">WIP Booking plan by Details</label>
                      </div>
                      <div>
                        <IconButton onClick={closeModal_WipBookingDetails}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <div style={{ height: 680, width: "100%" }}>
                      <DataGrid
                        // rows={WipPenDetails}
                        rows={WipBookingDetail.map((row) => ({
                          ...row,
                          qty_wip_detail: formatNumberWithCommas(row.qty_wip_detail), // Format the qty_pending field
                        }))}
                        columns={columns_WipBookingDetails}
                        // loading={!FGDetails.length}
                        pageSize={10}
                        checkboxSelection
                        // autoPageSize
                        style={{
                          minHeight: "400px",
                          border: "1px solid black",
                          backgroundColor: "#E4F1FF",
                        }}
                        slots={{ toolbar: CustomToolbar }}
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
