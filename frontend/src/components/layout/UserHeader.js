import React from "react";
import {
  Button,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../actionCreators";

function Header() {
  const is_staff = useSelector((state) => state.auth.user.is_staff);
  const dispatch = useDispatch();
  const { logout } = bindActionCreators(actionCreators, dispatch);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Button
          id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Profile
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem component={Link} to="/" onClick={logout}>
            Logout
          </MenuItem>
        </Menu>
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
        {is_staff ? (
          <Button
            variant="outlined"
            size="small"
            to="/offers/create/"
            component={Link}
          >
            Make an Offer
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            to="/orders/create/"
            component={Link}
          >
            Create Order
          </Button>
        )}
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;
