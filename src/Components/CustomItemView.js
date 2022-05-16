//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { EventRegister } from "react-native-event-listeners";
import { useDispatch, useSelector } from "react-redux";
import APICallService from "../API/APICallService";
import { Regular, SemiBold } from "../Assets/fonts";
import { Images } from "../Assets/images";
import { Route } from "../Navigation/Routes";
import { updateCartList } from "../ReduxStore/Actions/cartListAction";
import Colors from "../Utility/Colors";
import {
  ADD_TO_CART,
  ADD_WISHLIST,
  ALL_WISHLIST,
  NO_IMAGE_URL,
  UPDATE_CART_COUNT,
} from "../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../Utility/Helper";
import Logger from "../Utility/Logger";
import Navigator from "../Utility/Navigator";
import { Size } from "../Utility/sizes";
import Strings from "../Utility/Strings";

// create a component
const CustomItemView = (props) => {
  const [favarray, setFavarray] = useState([]);
  const [cartItem, setCartItem] = useState([]);

  const { cartListReducer } = useSelector((state) => ({
    cartListReducer: state.cartListReducer,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    checkFilter();
  }, [cartListReducer.cartList]);

  async function checkFilter() {
    if (cartListReducer.cartList.length > 0) {
      const cartList = cartListReducer.cartList;
      setCartItem(
        cartList.filter(function (item) {
          return item.item_code == props.item.item_code;
        })
      );
    } else {
      setCartItem([]);
    }
    await AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
      if (result) setFavarray(JSON.parse(result));
    });
  }

  const addToWishList = (product_item_code) => {
    AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
      const id = [product_item_code];
      if (result !== null && result != product_item_code) {
        if (JSON.parse(result).includes(product_item_code) == false) {
          var newIds = JSON.parse(result).concat(id);
          AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(newIds));
          const apiClass = new APICallService(ADD_WISHLIST, {
            product_item_code: newIds,
          });
          apiClass
            .callAPI()
            .then(async function (res) {
              if (validateResponse(res)) {
                showSuccessMessage(res.message);
                setFavarray(JSON.stringify(newIds));
              }
            })
            .catch((err) => {
              showErrorMessage(err.message);
            });
        } else {
          try {
            let favItemArray = JSON.parse(result);
            alteredItems = favItemArray.filter(function (e) {
              return e !== product_item_code;
            });
            AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(alteredItems));
            const apiClass = new APICallService(ADD_WISHLIST, {
              product_item_code: alteredItems,
            });
            apiClass
              .callAPI()
              .then(async function (res) {
                if (validateResponse(res)) {
                  showSuccessMessage(res.message);
                  setFavarray(JSON.stringify(alteredItems));
                }
              })
              .catch((err) => {
                showErrorMessage(err.message);
              });
          } catch (error) {
            Logger.log(error);
          }
        }
      } else {
        AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(id));
        const apiClass = new APICallService(ADD_WISHLIST, {
          product_item_code: id,
        });
        apiClass
          .callAPI()
          .then(async function (res) {
            if (validateResponse(res)) {
              showSuccessMessage(res.message);
              setFavarray(JSON.stringify(id));
            }
          })
          .catch((err) => {
            showErrorMessage(err.message);
          });
      }

      props.onRefresh && props.onRefresh();
    });
  };

  const addToCart = (product) => {
    const saveList = cartListReducer.cartList;

    if (saveList && saveList.length > 0) {
      for (const key in saveList) {
        const element = saveList[key];
        if (element.item_code == product.item_code) {
          if (
            element.quantity < parseInt(product.inventory[0].stock_quantity)
          ) {
            APICallAddToCart({
              product_item_code: element.item_code,
              quantity: element.quantity + 1,
            });
          } else {
            showErrorMessage("Stock limit over");
          }
        } else {
          APICallAddToCart({
            product_item_code: product.item_code,
            quantity: 1,
          });
        }
      }
    } else {
      APICallAddToCart({
        product_item_code: product.item_code,
        quantity: 1,
      });
    }
  };

  const APICallAddToCart = (product_list) => {
    const apiClass = new APICallService(ADD_TO_CART, {
      product: [product_list],
      order_using: "mobile",
      store_id: props.storeId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          const cartList = cartListReducer.cartList;

          let saveList = cartList && cartList.length > 0 ? [...cartList] : [];
          if (cartList && cartList.length > 0) {
            if (
              saveList.some(
                (item) => res.data.values[0].item_code == item.item_code
              )
            ) {
              const index = saveList.findIndex(
                (e) => e.item_code == res.data.values[0].item_code
              );
              saveList[index].quantity = res.data.values[0].quantity;
            } else {
              saveList.push(res.data.values[0]);
            }
          } else {
            saveList.push(res.data.values[0]);
          }

          const prefList = [...saveList];
          dispatch(updateCartList(prefList));
          showSuccessMessage("Cart updated successfully!");
          await EventRegister.emit(UPDATE_CART_COUNT, prefList.length);
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
      });
  };

  const updateCartData = async (product, quantity) => {
    let saveList = cartListReducer.cartList;
    product.quantity = quantity;
    if (saveList && saveList.length > 0) {
      for (const key in saveList) {
        const element = saveList[key];
        if (element.item_code == product.item_code) {
          if (quantity <= parseInt(product.inventory[0].stock_quantity)) {
            saveList[key].quantity = quantity;
          } else {
            showErrorMessage("Stock limit over");
          }
        }
      }
      saveList = saveList.filter(function (person) {
        return person.quantity != 0;
      });

      dispatch(updateCartList(saveList));

      await EventRegister.emit(UPDATE_CART_COUNT, saveList.length);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.list, props.listView]}
      activeOpacity={1}
      onPress={() => {
        Navigator.navigate(Route.ProductDetails, { id: props.item.item_code });
      }}
    >
      <View
        style={{
          backgroundColor: Colors.white,
          paddingHorizontal: Size.FindSize(5),
          paddingTop: Size.FindSize(15),
          paddingBottom: Size.FindSize(15),
          borderRadius: Size.FindSize(10),
          flex: 1,
        }}
      >
        <Image
          source={{
            uri: props?.item?.images
              ? props?.item?.images[0].url
              : NO_IMAGE_URL,
          }}
          resizeMode="contain"
          style={styles.item}
        />
        {props?.loginInfo ? (
          <TouchableOpacity
            style={styles.favView}
            onPress={() => addToWishList(props.item.item_code)}
          >
            {favarray.indexOf(props.item.item_code) !== -1 ? (
              <Image
                source={Images.heart}
                resizeMode="contain"
                style={styles.fav}
              />
            ) : (
              <Image
                source={Images.fav}
                resizeMode="contain"
                style={styles.fav}
              />
            )}
          </TouchableOpacity>
        ) : null}
        {props.item.offer ? (
          <TouchableOpacity
            style={{
              height: Size.FindSize(20),
              width: Size.FindSize(60),
              backgroundColor: Colors.green,
              marginLeft: Size.FindSize(15),
              position: "absolute",
              top: Size.FindSize(145),
              borderRadius: Size.FindSize(5),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: Size.FindSize(12),
                fontFamily: SemiBold,
              }}
            >
              {props.item.offer.type == "flat"
                ? "₹" + props.item.offer.discount + " off"
                : props.item.offer.discount + "% off"}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.flagView}>
          {props?.item?.country_of_origin ? (
            <CountryFlag isoCode={props?.item?.country_of_origin} size={13} />
          ) : null}
          {props.item.veg_non_veg && (
            <Image
              source={
                props.item.veg_non_veg == "Veg" ? Images.veg : Images.nonveg
              }
              resizeMode="contain"
              style={styles.veg}
            />
          )}
        </View>

        <Text style={styles.name} numberOfLines={1} ellipsizeMode={"tail"}>
          {props.item.item_name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.price}>₹{props.item.rsp}</Text>
          {props.item.rsp < props.item.mrp && (
            <Text style={styles.price1}>₹{props.item.mrp}</Text>
          )}
        </View>
        {props.item.inventory && props.item.inventory.length > 0 ? (
          <View>
            {cartItem.length > 0 ? (
              <View style={styles.countPanelView}>
                <TouchableOpacity
                  style={styles.minusButton}
                  onPress={() =>
                    updateCartData(cartItem[0], cartItem[0].quantity - 1)
                  }
                >
                  <Text style={styles.minusText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.countView} activeOpacity={1}>
                  <Text style={styles.countText}>{cartItem[0].quantity}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={() =>
                    updateCartData(cartItem[0], cartItem[0].quantity + 1)
                  }
                >
                  <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.cartView}
                onPress={() => addToCart(props.item)}
              >
                <Image
                  source={Images.cart}
                  resizeMode="contain"
                  style={styles.cart}
                />
                <Text style={styles.add}>{Strings.Add}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={styles.outStockView}
            opacity={0.5}
            needsOffscreenAlphaCompositing
          >
            <Text style={styles.add}>{Strings.OutOfStock}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  list: {
    width: Size.FindSize(180),
    marginLeft: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    marginTop: Size.FindSize(5),
    elevation: 2,

    marginBottom: Size.FindSize(15),
    shadowColor: "#000",
    shadowOffset: { width: Platform.OS == "ios" ? 0 : 1, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.5 : 0.1,
    shadowRadius: Platform.OS == "ios" ? 2 : 1,
  },
  item: {
    height: Size.FindSize(120),
    width: Size.FindSize(200),
    alignSelf: "center",
    borderTopLeftRadius: Size.FindSize(10),
    borderTopRightRadius: Size.FindSize(10),
  },
  favView: {
    position: "absolute",
    right: Size.FindSize(7),
    top: Size.FindSize(7),
  },
  fav: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
  },
  flag: {
    height: Size.FindSize(17),
    width: Size.FindSize(17),
  },
  veg: {
    height: Size.FindSize(17),
    width: Size.FindSize(17),
    marginLeft: Size.FindSize(7),
  },
  flagView: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: Size.FindSize(7),
    marginTop: Size.FindSize(3),
    minHeight: Size.FindSize(20),
  },
  name: {
    fontFamily: Regular,
    fontSize: Size.FindSize(16),
    color: Colors.headerText,
    marginHorizontal: Size.FindSize(10),
    marginTop: Size.FindSize(15),
  },
  price: {
    fontFamily: Regular,
    fontSize: Size.FindSize(18),
    color: Colors.Background,
    marginHorizontal: Size.FindSize(10),
  },
  cartView: {
    marginHorizontal: Size.FindSize(10),
    borderWidth: 1,
    borderColor: Colors.Background,
    borderRadius: Size.FindSize(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(42),
    marginTop: Size.FindSize(15),
  },
  outStockView: {
    marginHorizontal: Size.FindSize(10),
    borderWidth: 1,
    borderColor: Colors.Background,
    borderRadius: Size.FindSize(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(42),
    marginTop: Size.FindSize(15),
  },
  cart: {
    height: Size.FindSize(20),
    width: Size.FindSize(20),
    tintColor: Colors.Background,
  },
  add: {
    marginLeft: Size.FindSize(5),
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(16),
    alignSelf: "center",
  },
  price1: {
    textDecorationLine: "line-through",
    color: Colors.forgotText,
    fontSize: Size.FindSize(15),
    fontFamily: Regular,
  },
  countPanelView: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Size.FindSize(15),
    height: Size.FindSize(42),
    marginHorizontal: Size.FindSize(10),
  },
  minusButton: {
    height: Size.FindSize(42),
    width: Size.FindSize(40),
    backgroundColor: Colors.cookBorder,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: Size.FindSize(5),
    borderBottomLeftRadius: Size.FindSize(5),
  },
  plusButton: {
    height: Size.FindSize(42),
    width: Size.FindSize(40),
    backgroundColor: Colors.Background,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: Size.FindSize(5),
    borderBottomRightRadius: Size.FindSize(5),
  },
  minusText: {
    fontSize: Size.FindSize(20),
    lineHeight: Size.FindSize(42),
    color: Colors.headerText,
    fontFamily: Regular,
  },
  plusText: {
    fontSize: Size.FindSize(20),
    lineHeight: Size.FindSize(42),
    color: Colors.white,
    fontFamily: Regular,
  },
  countView: {
    height: Size.FindSize(42),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.cookBorder,
  },
  countText: {
    fontSize: Size.FindSize(20),
    lineHeight: Size.FindSize(42),
    color: Colors.Background,
    fontFamily: Regular,
    justifyContent: "center",
  },
});

//make this component available to the app
export default CustomItemView;
