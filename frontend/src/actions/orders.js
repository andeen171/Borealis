import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_ORDERS,
  DELETE_ORDER,
  CREATE_ORDER,
  EDIT_ORDER,
  GET_ORDER_DETAILS,
} from "./types";

export const getOrders = () => (dispatch) => {
  axios
    .get("/api/orders/")
    .then((res) => {
      dispatch({
        type: GET_ORDERS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteOrder = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/order/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteOrder: "Order Deleted" }));
      dispatch({
        type: DELETE_ORDER,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

export const createOrder = (order) => (dispatch, getState) => {
  axios
    .post("/api/leads/create/", order, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ createOrder: "Order created" }));
      dispatch({
        type: CREATE_ORDER,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
