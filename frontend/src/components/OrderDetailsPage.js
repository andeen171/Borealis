import React, { useEffect } from "react";
import Header from "./layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";
import Copyright from "./layout/Copyright";
import Carousel from "react-material-ui-carousel";
import Image from "mui-image";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";

export default function OrderDetailPage(props) {
  const order = useSelector((state) => state.orders.order);
  const offers = useSelector((state) => state.orders.offers);
  const dispatch = useDispatch();
  const { getOrderDetails } = bindActionCreators(actionCreators, dispatch);
  const orderCode = props.match.params.orderCode;
  useEffect(() => {
    getOrderDetails(orderCode);
  }, []);

  return (
    <React.Fragment>
      <Header />
      <Typography variant="h4">{order.title}</Typography>
      <Typography variant="h6">{order.description}</Typography>
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

                <Button
                  size="large"
                  variant="outlined"
                  color="success"
                  sx={{ position: "absolute", bottom: "0" }}
                >
                  Make an offer
                </Button>
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
                <CardActionArea component={Link} to={"/"}>
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
              </Grid>
            );
          })}
        </Grid>
      </div>
      <Copyright />
    </React.Fragment>
  );
}
