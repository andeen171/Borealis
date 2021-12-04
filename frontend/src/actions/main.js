import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_ORDERS,
  DELETE_ORDER,
  ACCEPT_OFFER,
  GET_ORDER_DETAILS,
  AUTH_ERROR,
  UPLOADING_FILES,
  CREATE_OFFER,
  ADVANCE_STAGE,
  GET_CONTRACT,
  FINISH_CONTRACT,
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
      dispatch(createMessage(res));
      dispatch({
        type: DELETE_ORDER,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

export const createOrder = (order, history) => (dispatch, getState) => {
  axios
    .post("/api/orders/", order, uploadConfig(dispatch, getState))
    .then((res) => {
      dispatch(history.push(`/order/${res.data.info.id}/`));
    });
};

export const getOrderDetails = (orderCode) => (dispatch, getState) => {
  axios
    .get(`/api/order/${orderCode}/`, uploadConfig(dispatch, getState))
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

export const createOffer =
  (
    order,
    problem,
    description,
    value_estimate,
    need_replacement,
    replacements
  ) =>
  (dispatch, getState) => {
    let config = uploadConfig(dispatch, getState);
    config.headers["Content-Type"] = "application/json";
    const body = JSON.stringify({
      problem,
      description,
      value_estimate,
      need_replacement,
      replacements,
      order,
    });

    axios
      .post("/api/offers/", body, config)
      .then((res) => {
        dispatch({
          type: CREATE_OFFER,
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
  axios
    .post("/api/offer/accept/", info, tokenConfig(dispatch, getState))
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

export const getContractInfo = (contract_id) => (dispatch, getState) => {
  axios
    .get(`/api/contract/${contract_id}/`, uploadConfig(dispatch, getState))
    .then((res) => {
      dispatch({
        type: GET_CONTRACT,
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

export const progressContract =
  (contract_id, description, ending_prediction) => (dispatch, getState) => {
    const config = uploadConfig(dispatch, getState);
    config.headers["Content-Type"] = "application/json";
    const body = JSON.stringify({ description, ending_prediction });
    axios
      .post(`/api/contract/${contract_id}/`, body, config)
      .then((res) => {
        dispatch({
          type: ADVANCE_STAGE,
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

export const finishContract = (contract_id) => (dispatch, getState) => {
  axios
    .post(
      `/api/contract/${contract_id}/`,
      null,
      uploadConfig(dispatch, getState)
    )
    .then((res) => {
      dispatch({
        type: FINISH_CONTRACT,
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

export const uploadConfig = (dispatch, getState) => {
  const token = getState().auth.token;
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

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
