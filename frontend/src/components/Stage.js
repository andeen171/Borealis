import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function Stage(props) {
  const { info } = props;

  return (
    <React.Fragment>
      <Grid container alignItems="left">
        <Typography component="h4" variant="h5" color="text.secondary">
          {info.started_at}
        </Typography>
        <br />
        <Typography component="h4" variant="h5" paragraph>
          {info.description}
        </Typography>
        <Typography component="h5" variant="h5">
          Ending prediction: {info.ending_prediction}
        </Typography>
      </Grid>
    </React.Fragment>
  );
}

Stage.propTypes = {
  info: PropTypes.shape({
    id: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    started_at: PropTypes.string.isRequired,
    ending_prediction: PropTypes.string.isRequired,
    finished: PropTypes.bool.isRequired,
    finished_at: null,
  }).isRequired,
};
