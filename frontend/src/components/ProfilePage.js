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
import { Box, Button, Modal, Paper, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Link, useHistory } from "react-router-dom";
import OfferCard from "./layout/OfferCard";
import ContractCard from "./layout/ContractCard";

const theme = createTheme();

export default function HomePage(props) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const orders = useSelector((state) => state.main.orders);
  const offers = useSelector((state) => state.main.offers);
  const contracts = useSelector((state) => state.main.contracts);
  const profile = useSelector((state) => state.main.profile);
  const own_id = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const history = useHistory();
  const { getProfile, loadUser, editProfile } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const [show, setShow] = React.useState(false);
  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user_id = props.match.params.userId;
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    editProfile(user_id, data, history);
    handleClose();
  };

  useEffect(() => {
    getProfile(user_id, history);
    loadUser();
  }, [profile.pfp, profile.description]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginBottom: "50px" }}>
        {isAuthenticated ? <UserHeader /> : <Header />}
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <img src={profile.pfp} style={{ borderRadius: "50%" }} />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h4" color="primary">
                  {profile.user.full_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography component="p" color="text.secondary">
                  {profile.description}
                </Typography>
              </Grid>
              {profile.user.id === own_id && (
                <React.Fragment>
                  <Grid item xs={12} align="right">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleOpen}
                    >
                      Edit
                    </Button>
                  </Grid>
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
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <input
                            type="file"
                            accept="image/*"
                            id="pfp"
                            name="pfp"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            type="text"
                            id="description"
                            name="description"
                            defaultValue={profile.description}
                            autoComplete="Description"
                            enabled="true"
                          />
                        </Grid>
                      </Grid>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="large"
                          color="success"
                          type="submit"
                        >
                          Update
                        </Button>
                      </Typography>
                    </Box>
                  </Modal>
                </React.Fragment>
              )}
              <Grid container spacing={5} sx={{ mt: 3 }}>
                <Grid item align="center" xs={6}>
                  <Button size="small" onClick={handleHide}>
                    Posts
                  </Button>
                </Grid>
                {profile.user.id === own_id && (
                  <Grid item align="center" xs={6}>
                    <Button size="small" onClick={handleShow}>
                      Contracts
                    </Button>
                  </Grid>
                )}

                {show
                  ? contracts.map((contract, i) => (
                      <React.Fragment>
                        <Grid key={i} item xs={12} md={6}>
                          <CardActionArea
                            component={Link}
                            to={"/contract/" + contract.id}
                          >
                            <ContractCard contract={contract} />
                          </CardActionArea>
                        </Grid>
                      </React.Fragment>
                    ))
                  : profile.user.is_staff
                  ? offers.map((offer, i) => (
                      <React.Fragment>
                        <Grid key={i} item xs={12} md={6}>
                          <CardActionArea
                            component={Link}
                            to={"/order/" + offer.order}
                          >
                            <OfferCard key={offer.id} offer={offer} />
                          </CardActionArea>
                        </Grid>
                      </React.Fragment>
                    ))
                  : orders.map((post, i) => (
                      <Grid key={i} item xs={12} md={6}>
                        <CardActionArea
                          component={Link}
                          to={"/order/" + post.id}
                        >
                          <OrderCard key={post.id} post={post} />
                        </CardActionArea>
                      </Grid>
                    ))}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Container>
      <Copyright />
    </ThemeProvider>
  );
}
