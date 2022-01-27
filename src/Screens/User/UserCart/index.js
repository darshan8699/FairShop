import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import Colors from "../../../Utility/Colors";
import { ADD_TO_CART, PREF_LOGIN_INFO } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const cartData = [
    {
      image: Images.test3,
      itemName: "Peri Peri Hummus",
      quantity: "150gm",
      price: "140",
    },
    {
      image: Images.test3,
      itemName: "Peri Peri Hummus",
      quantity: "150gm",
      price: "140",
    },
    {
      image: Images.test3,
      itemName: "Peri Peri Hummus",
      quantity: "150gm",
      price: "140",
    },
    {
      image: Images.test3,
      itemName: "Peri Peri Hummus",
      quantity: "150gm",
      price: "140",
    },
    {
      image: Images.test3,
      itemName: "Peri Peri Hummus",
      quantity: "150gm",
      price: "140",
    },
    {
      image: Images.test3,
      itemName: "Peri Peri Hummus",
      quantity: "150gm",
      price: "140",
    },
  ];
  const [loginData, setLoginData] = useState("");
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

  const checkOutButton = () => {
    var options = {
      description: "ALF-FARMS CHICKEN BACON150gm",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: "INR",
      key: "rzp_test_KcH2iILATfSbfc",
      amount: "180",
      name: "ALF-FARMS CHICKEN BACON150gm",
      order_id: "order_13", //Replace this with an order_id created using Orders API.
      prefill: {
        email: loginData?.email,
        contact: "91" + loginData?.phone,
        name:
          loginData?.profile?.first_name + " " + loginData?.profile?.last_name,
      },
      theme: { color: Colors.red },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  const renderCartItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image resizeMode="contain" source={item.image} style={styles.icon} />
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
          <Text style={styles.subTotalPrice}>₹{"1400"}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkOutView}
          onPress={() => checkOutButton()}
        >
          <Text style={styles.checkOutText}>{Strings.CheckOut}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
