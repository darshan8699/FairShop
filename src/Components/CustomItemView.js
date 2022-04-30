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
import APICallService from "../API/APICallService";
import { Regular, SemiBold } from "../Assets/fonts";
import { Images } from "../Assets/images";
import { Route } from "../Navigation/Routes";
import Colors from "../Utility/Colors";
import {
  ADD_TO_CART,
  ADD_WISHLIST,
  ALL_CART,
  ALL_WISHLIST,
  NO_IMAGE_URL,
  UPDATE_CART_COUNT,
} from "../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../Utility/Helper";
import Navigator from "../Utility/Navigator";
import { Size } from "../Utility/sizes";
import Strings from "../Utility/Strings";
import { EventRegister } from "react-native-event-listeners";
import CountryFlag from "react-native-country-flag";

// create a component
const CustomItemView = (props) => {
  const [favarray, setFavarray] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
      if (result) setFavarray(JSON.parse(result));
    });
  });

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
            console.log(error);
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
  const addToCartStorage = (product) => {
    console.log("check:-----");
    AsyncStorage.getItem(ALL_CART, (err, result) => {
      if (result && JSON.parse(result).length > 0) {
        let saveList = JSON.parse(result);
        for (const key in saveList) {
          if (saveList.hasOwnProperty(key)) {
            const element = saveList[key];
            if (element.item_code == product.item_code) {
              saveList[key].quantity = element.quantity + 1;
            }
          }
        }
        AsyncStorage.setItem(ALL_CART, JSON.stringify(saveList));
        let productList = [];
        for (const key in saveList) {
          if (saveList.hasOwnProperty(key)) {
            const element = saveList[key];
            productList.push({
              product_item_code: element.item_code,
              quantity: element.quantity,
            });
          }
        }
        APICallAddToCart(productList);
      }
    });
  };
  const addToCart = (product) => {
    AsyncStorage.getItem(ALL_CART, (err, result) => {
      product.quantity = 1;
      const cartList = [product];
      var prefList = [];
      if (result && JSON.parse(result).length > 0) {
        const saveList = JSON.parse(result);
        // prefList = [...saveList, ...cartList];
        for (const key in saveList) {
          if (saveList.hasOwnProperty(key)) {
            const element = saveList[key];
            if (element.item_code == product.item_code) {
              addToCartStorage(product);
            } else {
              prefList = [...saveList, ...cartList];
            }
          }
        }
      } else {
        prefList = [...cartList];
      }

      AsyncStorage.setItem(ALL_CART, JSON.stringify(prefList));
      let productList = [];
      for (const key in prefList) {
        if (prefList.hasOwnProperty(key)) {
          const element = prefList[key];
          console.log("element", element);
          console.log();
          productList.push({
            product_item_code: element.item_code,
            quantity: element.quantity,
          });
        }
      }
      APICallAddToCart(productList);
    });
  };

  const APICallAddToCart = (product_list) => {
    const apiClass = new APICallService(ADD_TO_CART, {
      product: product_list,
      order_using: "Web_store",
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          EventRegister.emit(UPDATE_CART_COUNT, product_list.length);
          showSuccessMessage("item added in cart");
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
      });
  };
  function percentage(partialValue, totalValue) {
    return Math.round(100 - (100 * partialValue) / totalValue);
  }
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
        {props.item.rsp < props.item.mrp && (
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
              {percentage(props.item.rsp, props.item.mrp) + "% off"}
            </Text>
          </TouchableOpacity>
        )}
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
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  list: {
    // height: Size.FindSize(280),
    width: Size.FindSize(180),
    // backgroundColor: Colors.white,
    marginLeft: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    marginTop: Size.FindSize(5),
    elevation: 2,
    // paddingHorizontal: Size.FindSize(5),
    // paddingTop: Size.FindSize(15),
    // paddingBottom: Size.FindSize(15),
    marginBottom: Size.FindSize(15),
    // overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: Platform.OS == "ios" ? 0 : 1, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.5 : 0.1,
    shadowRadius: Platform.OS == "ios" ? 2 : 1,
  },
  item: {
    // height: Size.FindSize(100),
    // width: Size.FindSize(180),
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
});

//make this component available to the app
export default CustomItemView;
