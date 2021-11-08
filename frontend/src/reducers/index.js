import { combineReducers } from "redux";
import auth from "./auth";
import main from "./main";

const reducer = combineReducers({
  auth: auth,
  main: main,
});

export default reducer;
