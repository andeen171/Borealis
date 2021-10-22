import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";
import { Typography, Grid } from "@material-ui/core";
import Button from "@mui/material/Button";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import SignInSide from "./loginPage";
import ClientRegisterPage from "./clientRegisterPage";
import ClientHomePage from "./clientHomePage";
import Header from "./layout/Header";

function HomePage() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const AC = bindActionCreators(actionCreators, dispatch);
  console.log(state);
  console.log(AC);
  return (
    <Grid container>
      <Header />
      <Grid item xs={12}>
        <Typography variant="h1" color="primary">
          Borealis
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" color="primary">
          Assistencia técnica
        </Typography>
      </Grid>
    </Grid>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/login" component={SignInSide} />
        <Route exact path="/register" component={ClientRegisterPage} />
        <Route exact path="/home/client" component={ClientHomePage} />
        <Route exact path="/home/technician" component={ClientHomePage} />
      </Switch>
    </Router>
  );
}
export default App;
