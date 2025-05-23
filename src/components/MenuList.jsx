import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
// import InboxIcon from "@mui/icons-material/Inbox";
// import MailIcon from "@mui/icons-material/Mail";
// import HomeIcon from "@mui/icons-material/Home";
// import AutoAwesomeMotionTwoToneIcon from "@mui/icons-material/AutoAwesomeMotionTwoTone";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import ManageSearchTwoToneIcon from "@mui/icons-material/ManageSearchTwoTone";
// import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
// import ViewCompactSharpIcon from "@mui/icons-material/ViewCompactSharp";
import WaterfallChartRoundedIcon from "@mui/icons-material/WaterfallChartRounded";
import StackedLineChartOutlinedIcon from "@mui/icons-material/StackedLineChartOutlined";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
// count usage function
import countUsageAnalysis from "./catchCount/CountUsageAnalysis.jsx";
import MicrowaveIcon from '@mui/icons-material/Microwave';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FolderCopyTwoToneIcon from '@mui/icons-material/FolderCopyTwoTone';

const MenuList = () => {
  //bind value user from localstorage
  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;

  const userGuest = localStorage.getItem("guestToken");
  const userGuestObject = JSON.parse(userGuest);
  const userGuestRole = userGuestObject?.user_role;
  // console.log('userGuestRole' , userGuestRole);

  return (
    <List>
      {/* <ListItem disablePadding sx={{ display: 'block',color: 'black' }} component={Link} to="/">
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    
                }}
                >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'inherit', // Set initial color
                                "&:hover": {
                                color: 'primary.main', // Change color on hover
                                }
                    }}
                    >
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem> */}
      {/* <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_fc_po"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <WaterfallChartRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Forecast Vs PO"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem> */}
      
      <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_fc_po_new"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <WaterfallChartRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Forecast Vs PO (New)"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        // set onclick to send count data to the server
        onClick={countUsageAnalysis}
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_fc_analysis"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <StackedLineChartOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Forecast Analysis"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        // set onclick to send count data to the server
        onClick={countUsageAnalysis}
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_fc_time_cap"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <MicrowaveIcon />
          </ListItemIcon>
          <ListItemText
            primary="Forecast Time Capacity"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        // set onclick to send count data to the server
        onClick={countUsageAnalysis}
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_fc_time_cap_chart"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <SsidChartIcon />
          </ListItemIcon>
          <ListItemText
            primary="Graph FC & Cap"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      {userGuestRole !== 'Guest' && (
        <ListItem
          // set onclick to send count data to the server
          onClick={countUsageAnalysis}
          disablePadding
          sx={{ display: "block", color: "black" }}
          component={Link}
          to="/pln_manage_mc_in_proc"
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: "inherit", // Set initial color
                "&:hover": {
                  color: "primary.main", // Change color on hover
                },
              }}
            >
              <PrecisionManufacturingIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Machine"
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      )}

      <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/proc_std_lt_master"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <WatchLaterIcon />
          </ListItemIcon>
          <ListItemText
            primary="Master Leadtime"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/prod_rout_no_std_lt"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <ManageHistoryIcon />
          </ListItemIcon>
          <ListItemText
            primary="Proessc no Leadtime"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      {/*  */}
      <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_prod_price_analysis"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <PriceChangeOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Product Price"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_po_fc_bill_to_master"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <CorporateFareIcon />
          </ListItemIcon>
          <ListItemText
            primary="PO-FC bill-to"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        disablePadding
        sx={{ display: "block", color: "black" }}
        component={Link}
        to="/pln_product_master"
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "inherit", // Set initial color
              "&:hover": {
                color: "primary.main", // Change color on hover
              },
            }}
          >
            <FolderCopyTwoToneIcon />
          </ListItemIcon>
          <ListItemText
            primary="Product Master"
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      
    </List>
  );
};

export default MenuList;
