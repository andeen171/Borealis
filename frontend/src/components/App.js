import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import OrderDetailPage from "./OrderDetailsPage";
import CreateOrderPage from "./CreateOrderPage";
import ContractDetailsPage from "./contractDetailsPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/orders/create" component={CreateOrderPage} />
        <Route
          path="/order/:orderCode"
          render={(props) => {
            return <OrderDetailPage {...props} />;
          }}
        />
        <Route
          path="/contract/:contractCode"
          render={(props) => {
            return <ContractDetailsPage {...props} />;
          }}
        />
      </Switch>
    </Router>
  );
}
export default App;
