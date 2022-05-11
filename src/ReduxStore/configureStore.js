import { combineReducers } from "redux";
import cartListReducer from "./Reducers/cartListReducer";

const rootReducer = combineReducers({ cartListReducer: cartListReducer });

export default rootReducer;
