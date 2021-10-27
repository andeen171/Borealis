import { combineReducers } from "redux";
import auth from "./auth";
import orders from "./orders";

const reducer = combineReducers({
  auth: auth,
  orders: orders,
});

export default reducer;
