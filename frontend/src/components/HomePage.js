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
        <main>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            {orders.map((post) => (
              <Grid item xs={12} md={6}>
                {isAuthenticated ? (
                  <CardActionArea
                    component={Link}
                    to={"/order/" + post.info.id}
                  >
                    <OrderCard key={post.info.id} post={post} />
                  </CardActionArea>
                ) : (
                  <CardActionArea onClick={handleOpen}>
                    <OrderCard key={post.info.id} post={post} />
                  </CardActionArea>
                )}
              </Grid>
            ))}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  You need to be logged in an account to see orders!
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    to="/login"
                    component={Link}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    to="/register"
                    component={Link}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Modal>
          </Grid>
        </main>
      </Container>
      <Copyright />
    </ThemeProvider>
  );
}
