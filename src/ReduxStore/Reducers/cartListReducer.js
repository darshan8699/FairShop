import { GET_CART_LIST } from "../types";

const initialState = {
  cartList: [],
};

const cartListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_LIST:
      return {
        ...state,
        cartList: action.payload,
      };
    default:
      return state;
  }
};
export default cartListReducer;
