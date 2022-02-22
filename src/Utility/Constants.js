export const UPDATE_CART_COUNT = "UPDATE_CART_COUNT";
export const PREF_TOKEN = "Token";
export const PREF_USER_ID = "PREF_USER_ID";
export const PREF_STORE_ID = "PREF_STORE_ID";
export const PREF_LOGIN_INFO = "loginInfo";
export const ALL_WISHLIST = "ALL_WISHLIST";
export const ALL_CART = "ALL_CART";
export const BASE_URL = "https://dev.fairshop.co.in/backend/public/api";
export const NO_IMAGE_URL =
  "https://dev.fairshop.co.in/_next/static/image/images/imgfallback.b48a540a7337fb7c68443ab63b361162.png";
export const GET = "GET";
export const GET_URL_PARAMS = "GET_URL_PARAMS";
export const GET_ID_PARAMS = "GET_ID_PARAMS";
export const POST = "POST";
export const POST_RAW = "POST_RAW";
export const POST_FORM = "POST_FORM";
export const PUT = "PUT";
export const POST_URL_PARAMS = "POST_URL_PARAMS";
export const DELETE_ID_PARAMS = "DELETE_ID_PARAMS";
export const MULTI_PART = "MULTI_PART";

//API Call

export const LOGIN = "/login" + " " + POST_FORM;
export const REGISTER = "/users" + " " + POST_FORM;
export const SEND_OTP = "/user/send-otp" + " " + POST_FORM;
export const VERIFY_OTP = "/user/verify-code" + " " + POST_FORM;
export const FORGOT_PASSWORD = "/forgotpassword" + " " + POST_FORM;
export const VERIFY_FORGOT_PASSWORD_OTP =
  "/verify-reset-password-token" + " " + POST_FORM;
export const LOGOUT = "/logout" + " " + GET;
export const RESET_PASSWORD = "/reset-password" + " " + POST_FORM;
export const CHANGE_PASSWORD = "/change-password" + " " + PUT;
export const CATEGORY_DROPDOWN = "/category-dropdown" + " " + GET;
export const PROFILE = "/users" + " " + PUT;
export const GET_PROFILE = "/me" + " " + GET;
export const MY_ADDRESS = "/address-my" + " " + GET;
export const ADD_ADDRESS = "/address" + " " + POST_FORM;
export const ATTACHMENTS = "/attachments" + " " + MULTI_PART;
export const SETTING_ABOUT = "/settings/pages/about" + " " + GET;
export const HOMEPAGE_NEW_PRODUCT = "/product-homepage-new" + " " + GET;
export const HOMEPAGE_POPULAR_PRODUCT = "/product-homepage-popular" + " " + GET;
export const CATEGORY = "/category" + " " + GET_URL_PARAMS;
export const HOMEPAGE_TOP_PICK = "/product-homepage-top-pick" + " " + GET;
export const PRODUCT_DETAILS = "/product" + " " + GET_ID_PARAMS;
export const STORE_LOCATOR = "/store" + " " + GET_URL_PARAMS;
export const WHISHLIST = "/wishlist" + " " + GET_URL_PARAMS;
export const DELETE_ADDRESS = "/address" + " " + DELETE_ID_PARAMS;
export const ADDRESS_IDWISE = "/address" + " " + GET_ID_PARAMS;
export const ORDERS = "/order" + " " + GET_URL_PARAMS;
export const OFFERS = "/discount/offers-list-optculture" + " " + GET;
export const HOME_BANNER = "/settings/pages/home" + " " + GET;
export const ADD_TO_CART = "/cart" + " " + POST_FORM;
export const ADD_WISHLIST = "/wishlist" + " " + POST_RAW;
export const PAYMENT_VERIFY = "/order/payment-verify" + " " + POST_FORM;
export const CREATE_ORDER = "/order" + " " + POST_FORM;
export const LOYALTY_INQUIRY = "/user/loyalty-inquiry" + " " + GET;
export const PRODUCT_LIST = "/product-list" + " " + GET_URL_PARAMS;
