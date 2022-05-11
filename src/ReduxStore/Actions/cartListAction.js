import { GET_CART_LIST } from "../types";

export const updateCartList = (data) => {
  return async (dispatch) => {
    dispatch({
      type: GET_CART_LIST,
      payload: data,
    });
  };
};
