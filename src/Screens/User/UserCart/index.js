import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import { Route } from "../../../Navigation/Routes";
import {
  ADD_TO_CART,
  ALL_CART,
  NO_IMAGE_URL,
  PREF_LOGIN_INFO,
  UPDATE_CART_COUNT,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
// create a component
const MyComponent = (props) => {
  const [loginData, setLoginData] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isShowLoader, setLoader] = useState(false);
  const [cartList, setCartList] = useState([]);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setLoginInfo();
    } else {
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      Logger.log("focus");
      // if (loginData) APICallCartList(loginData);
      AsyncStorageLib.getItem(ALL_CART, (err, result) => {
        if (result) {
          let list = JSON.parse(result);
          list = list.filter(function (person) {
            return person.quantity != 0;
          });
          Logger.log({ list });
          setCartList(list);
          updateCartTotal(list);
        }
      });
    });
    return () => unsubscribe();
  }, [props.currentFocus]);

  async function setLoginInfo() {
    const jsonValue = await AsyncStorageLib.getItem(PREF_LOGIN_INFO);
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setLoginData(loginInfo?.item);
      // APICallCartList(loginInfo?.item);
    }
  }

  const APICallCartList = (loginData) => {
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      user_id: loginData?.id,
      order_using: "Web_store",
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          // setCartList(res.data?.values);
          // let cartTotal = 0;
          // res.data?.values.map((item) => {
          //   cartTotal = cartTotal + item.mrp;
          // });
          // setTotalPrice(cartTotal);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  function updateCartTotal(cartList) {
    let cartTotal = 0;
    Logger.log("updateCartTotal=>", cartList);
    cartList.map((item) => {
      cartTotal = cartTotal + item.mrp * item.quantity;
    });
    setTotalPrice(cartTotal);
  }

  const APICallAddToCart = (product_list) => {
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      product: product_list,
      order_using: "Web_store",
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          EventRegister.emit(UPDATE_CART_COUNT, product_list.length);
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
        setLoader(false);
      });
  };

  const addToCartStorage = (product, quantity) => {
    AsyncStorageLib.getItem(ALL_CART, (err, result) => {
      product.quantity = quantity;

      if (result && JSON.parse(result).length > 0) {
        let saveList = JSON.parse(result);
        for (const key in saveList) {
          if (saveList.hasOwnProperty(key)) {
            const element = saveList[key];
            if (element.item_code == product.item_code) {
              saveList[key].quantity = quantity;
            }
          }
        }
        saveList = saveList.filter(function (person) {
          return person.quantity != 0;
        });
        AsyncStorageLib.setItem(ALL_CART, JSON.stringify(saveList));
        setCartList(saveList);
        updateCartTotal(saveList);
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

  const renderCartItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image
            resizeMode="contain"
            // source={{ uri: item.image ? item.image : NO_IMAGE_URL }}
            source={{ uri: item?.images ? item?.images[0].url : NO_IMAGE_URL }}
            style={styles.icon}
          />
          <View style={styles.textView}>
            <Text style={styles.item}>{item.item_name}</Text>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Text style={styles.priceText}>₹{item.mrp}</Text>
          </View>
        </View>
        <View style={styles.countPanelView}>
          <TouchableOpacity
            style={styles.minusButton}
            onPress={() => addToCartStorage(item, item.quantity - 1)}
          >
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countView} activeOpacity={1}>
            <Text style={styles.countText}>{item.quantity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => addToCartStorage(item, item.quantity + 1)}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      <Loader2 modalVisible={isShowLoader} />
      <Text style={styles.headerText}>{Strings.My_Cart}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cartList}
        renderItem={renderCartItem}
      />
      <NoDataView
        isVisible={cartList.length == 0}
        title={Strings.No_cart_found}
        containerStyle={{ height: Size.height / 2.5 }}
        isLoader={isShowLoader}
      />
      {cartList.length > 0 && (
        <View>
          <View style={styles.subTotalView}>
            <Text style={styles.subTotalText}>{Strings.Subtotal}</Text>
            <Text style={styles.subTotalPrice}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkOutView}
            // onPress={() => checkOutButton()}
            onPress={() => Navigator.navigate(Route.PaymentOrder)}
          >
            <Text style={styles.checkOutText}>{Strings.CheckOut}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

//make this component available to the app
export default MyComponent;
