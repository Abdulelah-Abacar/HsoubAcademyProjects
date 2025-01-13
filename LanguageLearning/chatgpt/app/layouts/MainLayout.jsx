"use client";
import { useContext } from "react";
import {
  Grid,
  Toolbar,
  CssBaseline,
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../components/SideBar/SideBar";
import ToolBar from "../components/ToolBar/ToolBar";
import { AppContext } from "../context/AppContext";
import Footer from "../components/Footer/Footer";
import styles from "./MainLayout.module.css";

const MainLayout = (props) => {
  const { window } = props;
  const { drawerWidth, errorMessage, showAlert, setShowAlert } =
    useContext(AppContext);

  return (
    <Grid container spacing={0} direction={"column"}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <ToolBar />
        <SideBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mx: "auto",
            maxWidth: 750,
          }}
        >
          <Toolbar />
          {props.loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CircularProgress sx={{ mt: 25 }} />
              <Typography component="p">{props.loadingText}</Typography>
            </Box>
          ) : (
            props.children
          )}
        </Box>
      </Box>
      <Box className={styles.footer}>
        <Footer onButtonClick={props.onButtonClick} />
      </Box>
      {showAlert && (
        <Snackbar open={showAlert}>
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorMessage}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setShowAlert(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Alert>
        </Snackbar>
      )}
    </Grid>
  );
};

export default MainLayout;
