import {
  GET_ORDERS,
  DELETE_ORDER,
  CREATE_ORDER,
  EDIT_ORDER,
  GET_ORDER_DETAILS,
  UPLOADING_FILES,
} from "../actions/types";

const initialState = {
  orders: [],
  order: {
    images: [],
    info: {
      title: "",
      description: "",
      image: [],
      created_at: "",
      closed: "",
      closed_at: "",
      category: 0,
      user: null,
    },
  },
  offers: [],
  progress: 0,
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
    case UPLOADING_FILES:
      return {
        ...state,
        progress: action.payload,
      };
    case GET_ORDER_DETAILS:
      return {
        ...state,
        order: action.payload.order,
        offers: action.payload.offers ? action.payload.offers : [],
      };
    default:
      return state;
  }
};
export default reducer;
