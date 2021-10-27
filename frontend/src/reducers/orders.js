import {
  GET_ORDERS,
  DELETE_ORDER,
  CREATE_ORDER,
  EDIT_ORDER,
  GET_ORDER_DETAILS,
} from "../actions/types";

const initialState = {
  orders: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    case DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };
    case CREATE_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    default:
      return state;
  }
};
export default reducer;
