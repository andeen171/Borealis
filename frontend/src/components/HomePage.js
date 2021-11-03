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

const theme = createTheme();

export default function HomePage() {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const { getOrders } = bindActionCreators(actionCreators, dispatch);
  useEffect(getOrders, ["orders"]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header />
        <main>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            {orders.map((post) => (
              <OrderCard key={post.info.title} post={post} />
            ))}
          </Grid>
        </main>
      </Container>
    </ThemeProvider>
  );
}
