import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function ContractCard(props) {
  const { contract } = props;
  return (
    <Card sx={{ display: "flex" }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography component="h2" variant="h5">
          {contract.value}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {contract.created_at}
        </Typography>
        <Typography variant="subtitle1" color="secondary">
          {contract.level}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {contract.closed ? "Finished" : "On-going"}
        </Typography>
      </CardContent>
    </Card>
  );
}

ContractCard.propTypes = {
  contract: PropTypes.shape({
    id: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    closed: PropTypes.bool.isRequired,
  }),
};
