import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import { Route } from "../../../Navigation/Routes";
import {
  ADD_TO_CART,
  NO_IMAGE_URL,
  PREF_LOGIN_INFO,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
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
      if (loginData) APICallCartList(loginData);
    });
    return () => unsubscribe();
  }, [props.currentFocus]);

  async function setLoginInfo() {
    const jsonValue = await AsyncStorageLib.getItem(PREF_LOGIN_INFO);
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setLoginData(loginInfo?.item);
      APICallCartList(loginInfo?.item);
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
          setCartList(res.data?.values);
          let cartTotal = 0;
          res.data?.values.map((item) => {
            cartTotal = cartTotal + item.net_price;
          });
          setTotalPrice(cartTotal);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const addToCart = (product_item_code, quantity) => {
    Logger.log(product_item_code, " quantity=> " + quantity);
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      product: [{ product_item_code: product_item_code, quantity: quantity }],
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          //showSuccessMessage(res.message);
          APICallCartList(loginData);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const renderCartItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image
            resizeMode="contain"
            source={{ uri: item.image ? item.image : NO_IMAGE_URL }}
            style={styles.icon}
          />
          <View style={styles.textView}>
            <Text style={styles.item}>{item.item_name}</Text>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Text style={styles.priceText}>₹{item.net_price}</Text>
          </View>
        </View>
        <View style={styles.countPanelView}>
          <TouchableOpacity
            style={styles.minusButton}
            onPress={() => addToCart(item.item_code, item.quantity - 1)}
          >
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countView} activeOpacity={1}>
            <Text style={styles.countText}>{item.quantity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => addToCart(item.item_code, item.quantity + 1)}
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
      <Text style={styles.headerText}>{Strings.My_Cart}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cartList}
        renderItem={renderCartItem}
      />
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
    </View>
  );
};

//make this component available to the app
export default MyComponent;
