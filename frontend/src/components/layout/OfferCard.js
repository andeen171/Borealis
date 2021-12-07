import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function OfferCard(props) {
  const { offer } = props;
  return (
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
          {offer.need_replacement ? "Replacements: " + offer.replacements : ""}
        </Typography>
        <Typography variant="subtitle1" paragraph>
          {offer.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

OfferCard.propTypes = {
  offer: PropTypes.shape({
    problem: PropTypes.string.isRequired,
    sent_at: PropTypes.string.isRequired,
    value_estimate: PropTypes.string.isRequired,
    need_replacement: PropTypes.bool.isRequired,
    replacements: PropTypes.string,
    description: PropTypes.string.isRequired,
  }),
};
