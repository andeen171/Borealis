import React from "react";
import { Button, IconButton, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

function Header() {
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Button variant="outlined" size="small" to="/login" component={Link}>
          Sign in
        </Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          <Button size="large" to="/" component={Link}>
            Borealis
          </Button>
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Button variant="outlined" size="small" to="/register" component={Link}>
          Sign up
        </Button>
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;
