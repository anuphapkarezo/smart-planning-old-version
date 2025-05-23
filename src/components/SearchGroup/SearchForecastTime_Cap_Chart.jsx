import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
//count usage function
import countUsagedPO from "../catchCount/CountUsagePO.jsx";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function SearchForecastTime_Cap_Chart({ onSearch }) {
  const [error, setError] = useState(null);

  //Set Dropdown List
  const [selectedFC_Period, setSelectedFC_Period] = useState(null);
  const [SelectedFactory, setSelectedFactory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedGroupProcesses, setSelectedGroupProcesses] = useState([]);

  //Set Parameter from API
  const [distinctFC_Period, setDistinctFC_Period] = useState([]);
  const [distinctFactory, setDistinctFactory] = useState([]);
  const [distinctUnit, setDistinctUnit] = useState([]);
  const [distinctGroupProcess, setDistinctGroupProcess] = useState([]);

  const fetchPeriod_Fc = async () => {
    try {
      const response = await axios.get(
        "http://10.17.100.115:3001/api/smart_planning/filter-period-fc-time-list"
      );
      const data = response.data;
      setDistinctFC_Period(data);
    } catch (error) {
      console.error(`Error fetching distinct data Period List: ${error}`);
    }
  };

  const fetchFactory = async () => {
    try {
      const response = await axios.get(
        "http://10.17.100.115:3001/api/smart_planning/filter-factory-list"
      );
      const data = response.data;
      setDistinctFactory(data);
    } catch (error) {
      console.error(`Error fetching distinct data Period List: ${error}`);
    }
  };

  const fetchUnit = async () => {
    // console.log('SelectedFactory >' , SelectedFactory);
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-unit-list?factory=${SelectedFactory?.factory}&period=${selectedFC_Period?.period_no}`
      );
      const data = response.data;
      setDistinctUnit(data);
    } catch (error) {
      console.error(`Error fetching distinct data Unit List: ${error}`);
    }
  };

  const fetchGroupProcess = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_planning/filter-group-process-list?factory=${SelectedFactory?.factory}&unit=${selectedUnit?.unit}&period=${selectedFC_Period?.period_no}`
      );
      const data = response.data;
      setDistinctGroupProcess(data);
    } catch (error) {
      console.error(`Error fetching distinct data Group process List: ${error}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  //สร้าง Function selection change
  const handleFC_PeriodChange = (event, newValue) => {
    setSelectedFC_Period(newValue);
    // setSelectedFactory(null);
    // setSelectedUnit(null);
    // setSelectedGroupProcesses([]);
  };

  const handleFactoryChange = (event, newValue) => {
    setSelectedFactory(newValue);
    setSelectedUnit(null);
    setSelectedGroupProcesses([]);
  };

  const handleUnitChange = (event, newValue) => {
    setSelectedUnit(newValue);
    setSelectedGroupProcesses([]);
  };

  const handleGroupProcessChange = (event, newValues) => {
    setSelectedGroupProcesses(newValues || []);
  };

  const handleSearch = () => {
    if (selectedFC_Period == null || SelectedFactory == null || selectedUnit == null || selectedGroupProcesses.length === 0) {
      // console.log('1');
    } else {
      // console.log('2');
      const queryParams = {
        fc_period: selectedFC_Period.period_no,
        factory: SelectedFactory.factory,
        unit: selectedUnit.unit,
        group_processes: selectedGroupProcesses.map(gp => gp.group_process),
      };
      console.log(queryParams);
      onSearch(queryParams); // Invoke the callback function with the selected values
    }
  };

  useEffect(() => {
    fetchPeriod_Fc();
    if (selectedFC_Period == null) {
    } else {
      fetchFactory();
    }
    if (SelectedFactory == null) {
    } else {
      fetchUnit();
    }
    if (selectedUnit == null) {
    } else {
      fetchGroupProcess();
    }
  }, [selectedFC_Period, SelectedFactory, selectedUnit]);

  return (
    <React.Fragment>
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
          Forecast time & Capacity level by process (Chart)
        </h5>
      </div>
      <Box maxWidth="xl" sx={{ width: "100%", height: 50 }}>
        <Grid container spacing={0} style={{ width: 1350 }}>
          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo-series"
                size="small"
                options={distinctFC_Period}
                getOptionLabel={(option) => option && option.period_no}
                value={selectedFC_Period}
                onChange={handleFC_PeriodChange}
                sx={{ width: 215 }}
                renderInput={(params) => (
                  <TextField {...params} label="Forecast Period" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.period_no === value.period_no
                }
              />
            </div>
          </Grid>

          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                disablePortal
                // freeSolo
                id="combo-box-demo-product"
                size="small"
                options={distinctFactory}
                getOptionLabel={(option) => option && option.factory}
                value={SelectedFactory}
                onChange={handleFactoryChange}
                sx={{ width: 215 }}
                renderInput={(params) => (
                  <TextField {...params} label="Factory" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.factory === value.factory
                }
              />
            </div>
          </Grid>

          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                disablePortal
                // freeSolo
                id="combo-box-demo-product"
                size="small"
                options={distinctUnit}
                getOptionLabel={(option) => option && option.unit}
                value={selectedUnit}
                onChange={handleUnitChange}
                sx={{ width: 215 }}
                renderInput={(params) => (
                  <TextField {...params} label="Unit" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.unit === value.unit
                }
              />
            </div>
          </Grid>

          <Grid item xs={2} md={2}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Autocomplete
                multiple
                disablePortal
                // freeSolo
                id="combo-box-demo-product"
                size="small"
                options={distinctGroupProcess}
                getOptionLabel={(option) => option && option.group_process}
                value={selectedGroupProcesses}
                onChange={handleGroupProcessChange}
                sx={{ width: 500 }}
                renderInput={(params) => (
                  <TextField {...params} label="Group process" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option && value && option.group_process === value.group_process
                }
              />
            </div>
          </Grid>

          <Grid item xs={2} md={2}>
            <Button
              variant="contained"
              size="small"
              style={{
                width: "150px",
                height: "40px",
                marginLeft: "300px",
                backgroundColor: '#40A578'
              }}
              onClick={() => {
                handleSearch();
              }}
            >
              Search
            </Button>
          </Grid>

        </Grid>
      </Box>
    </React.Fragment>
  );
}

export default SearchForecastTime_Cap_Chart;
