import React, { useEffect } from "react";
import Header from "./layout/Header";
import UserHeader from "./layout/UserHeader";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";
import Copyright from "./layout/Copyright";
import Carousel from "react-material-ui-carousel";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "mui-image";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Container,
  Box,
  Modal,
} from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import CssBaseline from "@mui/material/CssBaseline";
import { useHistory } from "react-router-dom";

const theme = createTheme();

export default function OrderDetailPage(props) {
  const order = useSelector((state) => state.main.order);
  const offers = useSelector((state) => state.main.offers);
  const is_staff = useSelector((state) => state.auth.user.is_staff);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const { getOrderDetails, loadUser, acceptOffer } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const orderCode = props.match.params.orderCode;
  useEffect(() => {
    getOrderDetails(orderCode);
    loadUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {isAuthenticated ? <UserHeader /> : <Header />}
        <div
          style={{
            marginTop: "50px",
            marginLeft: "75px",
            marginRight: "75px",
            marginBottom: "75px",
            color: "#494949",
          }}
        >
          <br />
          <Card raised sx={{ borderRadius: 1 }}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={8}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h3" color="primary">
                    {order.info.title}
                  </Typography>
                  <br />
                  <Typography variant="h5">{order.info.description}</Typography>
                  {is_staff ? (
                    <Button
                      size="large"
                      variant="outlined"
                      color="success"
                      sx={{ position: "absolute", bottom: "60px" }}
                    >
                      Make an offer
                    </Button>
                  ) : null}
                </CardContent>
              </Grid>
              <Grid item align="center" xs={4}>
                <Carousel>
                  {order.images.map((image, i) => {
                    return (
                      <CardMedia
                        className="Media"
                        key={i}
                        sx={{
                          width: "100%",
                          maxHeight: "100%",
                          borderRadius: 1,
                        }}
                      >
                        <Image src={image.src} showLoading={true} fit="fill" />
                      </CardMedia>
                    );
                  })}
                </Carousel>
              </Grid>
            </Grid>
          </Card>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            {offers.map((offer, i) => {
              return (
                <Grid item xs={12} md={6} key={i}>
                  <CardActionArea onClick={handleOpen}>
                    <Card sx={{ display: "flex" }}>
                      <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5">
                          {offer.problem}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {offer.sent_at}
                        </Typography>
                        <Typography variant="subtitle1" color="secondary">
                          {offer.value_estimate}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {offer.need_replacement
                            ? "Replacements: " + offer.replacements
                            : ""}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                          {offer.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </CardActionArea>
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
                      <Typography component="h2" variant="h5">
                        {offer.problem}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {offer.sent_at}
                      </Typography>
                      <Typography variant="subtitle1" color="secondary">
                        {offer.value_estimate}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {offer.need_replacement
                          ? "Replacements: " + offer.replacements
                          : ""}
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        {offer.description}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          to="/login"
                          color="success"
                          onClick={() =>
                            acceptOffer(
                              {
                                order: parseInt(orderCode),
                                offer: offer.id,
                              },
                              history
                            )
                          }
                        >
                          Accept offer
                        </Button>
                      </Typography>
                    </Box>
                  </Modal>
                </Grid>
              );
            })}
          </Grid>
        </div>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
