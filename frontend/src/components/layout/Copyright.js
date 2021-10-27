import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to="/" component={RouterLink}>
        Borealis
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
