import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";
import OrderCard from "./layout/OrderCard";
import Header from "./layout/Header";
import UserHeader from "./layout/UserHeader";
import Copyright from "./layout/Copyright";
import { Box, Button, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";

const theme = createTheme();

export default function HomePage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const orders = useSelector((state) => state.main.orders);
  const dispatch = useDispatch();
  const { getOrders, loadUser } = bindActionCreators(actionCreators, dispatch);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    getOrders();
    loadUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginBottom: "50px" }}>
        {isAuthenticated ? <UserHeader /> : <Header />}
        <main></main>
      </Container>
      <Copyright />
    </ThemeProvider>
  );
}
