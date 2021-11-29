import {
  GET_ORDERS,
  DELETE_ORDER,
  CREATE_ORDER,
  EDIT_ORDER,
  GET_ORDER_DETAILS,
  UPLOADING_FILES,
  ACCEPT_OFFER,
  CREATE_OFFER,
  ADVANCE_STAGE,
} from "../actions/types";

const initialState = {
  orders: [],
  order: {
    images: [],
    info: {
      title: "",
      device: "",
      description: "",
      created_at: "",
      closed: "",
      closed_at: "",
      category: "",
      user: null,
    },
  },
  offers: [],
  progress: 0,
  stages: [],
  contract: {
    value: 0,
    level: 1,
    created_at: "",
    closed: false,
    closed_at: "",
    order: 0,
    offer: 0,
    client: 0,
    technician: 0,
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
    case ACCEPT_OFFER:
      return {
        ...state,
        contract: action.payload,
      };
    case CREATE_OFFER:
      return {
        ...state,
        offers: [action.payload, ...state.offers],
      };
    case ADVANCE_STAGE:
      return {
        ...state,
        contract: action.payload.info,
        stages: [action.payload.stages, ...state.stages],
      };
    default:
      return state;
  }
};
export default reducer;
