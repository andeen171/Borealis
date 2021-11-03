import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router-dom";

export default function OrderCard(props) {
  const { post } = props;
  const info = post.info;
  const images = post.images[0];

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component={Link} to={"/order/" + info.id}>
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {info.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {info.created_at}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {info.description}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: "none", sm: "block" } }}
            image={images.src}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

OrderCard.propTypes = {
  post: PropTypes.shape({
    info: PropTypes.shape({
      id: PropTypes.number.isRequired,
      created_at: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    images: PropTypes.array.isRequired,
  }).isRequired,
};
