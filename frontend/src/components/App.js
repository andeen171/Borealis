import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignInSide from "./loginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={SignInSide} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    </Router>
  );
}
export default App;
