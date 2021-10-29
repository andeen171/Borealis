import {
  GET_ORDERS,
  DELETE_ORDER,
  CREATE_ORDER,
  EDIT_ORDER,
  GET_ORDER_DETAILS,
} from "../actions/types";

const initialState = {
  orders: [],
  order: {
    title: "",
    description: "",
    image: [],
    created_at: "",
    closed: "",
    closed_at: "",
    category: 0,
    user: null,
  },
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
    case GET_ORDER_DETAILS:
      return {
        ...state,
        order: action.payload.order,
        offers: action.payload.order,
      };
    default:
      return state;
  }
};
export default reducer;
