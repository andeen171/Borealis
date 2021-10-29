import React from "react";
import { Button, IconButton, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function SignInButton() {
  return (
    <Button variant="outlined" size="small" to="/login" component={Link}>
      Sign in
    </Button>
  );
}

function SignUpButton() {
  return (
    <Button variant="outlined" size="small" to="/register" component={Link}>
      Sign up
    </Button>
  );
}

function ProfileButton() {
  return (
    <Button variant="outlined" size="small" to="/profile" component={Link}>
      Profile
    </Button>
  );
}

function CreateOrderButton() {
  return (
    <Button
      variant="outlined"
      size="small"
      to="/orders/create"
      component={Link}
    >
      Create Order
    </Button>
  );
}

function MakeOfferButton() {
  return (
    <Button
      variant="outlined"
      size="small"
      to="/offers/create"
      component={Link}
    >
      Make an Offer
    </Button>
  );
}

function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const LeftButton = isAuthenticated ? SignInButton : ProfileButton;
  const RightButton = isAuthenticated ? SignUpButton : CreateOrderButton;

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <LeftButton />
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
        <RightButton />
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;
