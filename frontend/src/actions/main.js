import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import {
  GET_ORDERS,
  DELETE_ORDER,
  ACCEPT_OFFER,
  GET_ORDER_DETAILS,
  AUTH_ERROR,
  UPLOADING_FILES,
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
    .catch((err) => {
      if (err.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
        });
      }
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const deleteOrder = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/order/${id}/`, tokenConfig(dispatch, getState))
    .then((res) => {
      dispatch(createMessage({ deleteOrder: "Order Deleted" }));
      dispatch({
        type: DELETE_ORDER,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

export const createOrder = (order, history) => (dispatch, getState) => {
  axios
    .post("/api/order/create/", order, tokenConfig(dispatch, getState))
    .then((res) => {
      dispatch(history.push(`/order/${res.data.info.id}/`));
    });
};

export const getOrderDetails = (orderCode) => (dispatch, getState) => {
  axios
    .get(`/api/order/${orderCode}/`, tokenConfig(dispatch, getState))
    .then((res) => {
      dispatch({
        type: GET_ORDER_DETAILS,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
        });
      }
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const acceptOffer = (info, history) => (dispatch, getState) => {
  let config = tokenConfig(dispatch, getState);
  config.headers["Content-Type"] = "application/json";
  axios
    .post("/api/offer/accept/", info, config)
    .then((res) => {
      dispatch(
        {
          type: ACCEPT_OFFER,
          payload: res.data,
        },
        history.push(`/contract/${res.data.id}`)
      );
    })
    .catch((err) => {
      if (err.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
        });
      }
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const tokenConfig = (dispatch, getState) => {
  // Get token from state
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      dispatch({
        type: UPLOADING_FILES,
        payload: Math.round((event.loaded * 100) / event.total),
      });
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
