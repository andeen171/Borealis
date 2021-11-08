import React, { useEffect } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Redirect } from "react-router-dom";
import Copyright from "./layout/Copyright";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";

const theme = createTheme();

export default function RegisterPage() {
  const dispatch = useDispatch();
  const is_staff = useSelector((state) => state.auth.user.is_staff);
  const progress = useSelector((state) => state.main.progress);
  const { loadUser, createOrder } = bindActionCreators(
    actionCreators,
    dispatch
  );
  useEffect(() => {
    loadUser();
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createOrder(data);
  };
  if (is_staff || progress === 100) {
    return <Redirect to="/" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Create order
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="Title"
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Order Title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Order Description"
                  name="description"
                  autoComplete="Description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="category"
                  label="Category"
                  name="category"
                  autoComplete="Category"
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  id="images"
                  name="images"
                  multiple
                />
              </Grid>
            </Grid>
            {progress > 0 ? (
              <Grid item xs={12} align="center">
                <CircularProgress variant="determinate" value={progress} />
              </Grid>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create
              </Button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
