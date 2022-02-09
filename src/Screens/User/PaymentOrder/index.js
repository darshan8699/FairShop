import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  LogBox,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RazorpayCheckout from "react-native-razorpay";
import APICallService from "../../../API/APICallService";
import { Bold, Regular } from "../../../Assets/fonts";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import {
  ADD_TO_CART,
  ALL_CART,
  CREATE_ORDER,
  MY_ADDRESS,
  NO_IMAGE_URL,
  PAYMENT_VERIFY,
  PREF_LOGIN_INFO,
  PREF_STORE_ID,
  UPDATE_CART_COUNT,
} from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import { EventRegister } from "react-native-event-listeners";

// create a component
const PaymentOrder = (props) => {
  const [loginData, setLoginData] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isShowLoader, setLoader] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [addressIndex, setAddressIndex] = useState(null);
  const [billingAddressIndex, setBillingAddressIndex] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setLoginInfo();
    } else {
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
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
      // APICallCartList(loginInfo?.item);
      getCartList();
      APICallGetAddressData();
    }
  }

  function getCartList() {
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
  }

  function updateCartTotal(cartList) {
    let cartTotal = 0;
    Logger.log("updateCartTotal=>", cartList);
    cartList.map((item) => {
      cartTotal = cartTotal + item.mrp * item.quantity;
    });
    setTotalPrice(cartTotal);
  }

  const APICallGetAddressData = () => {
    setLoader(true);
    const apiClass = new APICallService(MY_ADDRESS, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setAddressList(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

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

  const APICallVerifyPayament = (
    order_id,
    payment_status,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  ) => {
    setLoader(true);
    const apiClass = new APICallService(PAYMENT_VERIFY, {
      order_id: order_id,
      payment_status: payment_status,
      razorpay_data: {
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      },
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage("Order payment sucessfully");
          AsyncStorageLib.setItem(ALL_CART, JSON.stringify([]));
          props.navigation.goBack();
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallCreateOrder = async () => {
    Keyboard.dismiss();
    if (addressIndex == null) {
      showErrorMessage(Strings.error_Address);
      return;
    } else if (billingAddressIndex == null) {
      showErrorMessage(Strings.error_Address);
      return;
    } else if (paymentMode == null) {
      showErrorMessage(Strings.error_paymentMode);
      return;
    }
    const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setLoader(true);
    const redAddress =
      addressList[addressIndex].full_name +
      ", " +
      addressList[addressIndex].phone +
      ", " +
      addressList[addressIndex].address_line_1 +
      ", " +
      addressList[addressIndex].address_line_2 +
      ", " +
      addressList[addressIndex].landmark +
      ", " +
      addressList[addressIndex].city +
      ", " +
      addressList[addressIndex].state +
      " " +
      addressList[addressIndex].pincode;

    const billingAddress =
      addressList[addressIndex].full_name +
      ", " +
      addressList[addressIndex].phone +
      ", " +
      addressList[addressIndex].address_line_1 +
      ", " +
      addressList[addressIndex].address_line_2 +
      ", " +
      addressList[addressIndex].landmark +
      ", " +
      addressList[addressIndex].city +
      ", " +
      addressList[addressIndex].state +
      " " +
      addressList[addressIndex].pincode;

    let prodList = [];
    for (const key in cartList) {
      if (cartList.hasOwnProperty(key)) {
        const element = cartList[key];
        prodList.push({
          product_item_code: element.item_code,
          quantity: element.quantity,
        });
      }
    }

    const apiClass = new APICallService(CREATE_ORDER, {
      order_using: "Web",
      store_id: id,
      customer_contact: loginData?.phone,
      payment_gateway: paymentMode == 1 ? "razorpay" : "cod",
      shipping_address: redAddress,
      billing_address: billingAddress,
      order_notes: orderNotes,
      product: prodList,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          if (paymentMode == 2) {
            showSuccessMessage(res.message);
            AsyncStorageLib.setItem(ALL_CART, JSON.stringify([]));
            props.navigation.goBack();
          } else {
            proceedToPayment(
              res?.data?.item?.id,
              res?.data?.item?.razorpay_order_id
            );
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const proceedToPayment = (order_id, razorpay_order_id) => {
    var options = {
      // description: "PSO WHOLE WHEAT CHAKKI ATTA- POUCH 2Kg",
      image: "https://fairshop.co.in/assets/images/fairshop-logo.svg",
      currency: "INR",
      key: "rzp_test_KcH2iILATfSbfc",
      amount: totalPrice + "00",
      // name: "ALF-FARMS CHICKEN BACON150gm",
      order_id: razorpay_order_id, //Replace this with an order_id created using Orders API.
      prefill: {
        email: loginData?.email,
        contact: "+91" + loginData?.phone,
        name:
          loginData?.profile?.first_name + " " + loginData?.profile?.last_name,
      },
      theme: { color: Colors.Background },
    };
    Logger.log({ options });
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        Logger.log(data);
        APICallVerifyPayament(
          order_id,
          "success",
          data?.razorpay_order_id,
          data?.razorpay_payment_id,
          data?.razorpay_signature
        );
      })
      .catch((error) => {
        // handle failure
        Logger.log(error);
        Alert.alert("", `${error.description}`);
      });
  };

  const renderCartItem = ({ item }) => (
    <View style={{}}>
      <View style={styles.listView}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image
            resizeMode="contain"
            source={{ uri: item.image ? item.image : NO_IMAGE_URL }}
            style={styles.icon}
          />
          <View style={styles.textView}>
            <Text style={styles.item}>{item.item_name}</Text>
            {/* <Text style={styles.quantityText}>{item.quantity}</Text> */}
            <Text style={styles.priceText}>₹{item.mrp}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: Size.FindSize(15),
          paddingHorizontal: Size.FindSize(10),
        }}
      >
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
        <Text style={styles.priceText2}>₹{item.mrp * item.quantity}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );

  const renderAddressList = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.addressItemView,
        {
          borderColor:
            addressIndex == index ? Colors.Background : Colors.border,
          backgroundColor:
            addressIndex == index ? Colors.pinkBack : Colors.white,
        },
      ]}
      onPress={() => setAddressIndex(index)}
    >
      <View>
        <Text
          style={styles.addressameText}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {item.name}
        </Text>
        <Text style={styles.addressText1}>{item.full_name}</Text>
        <Text style={styles.addressText1}>
          {item.address_line_1 + ", " + item.address_line_2}
        </Text>
        <Text style={styles.addressText1}>{item.landmark}</Text>
        <Text style={styles.addressText1}>
          {item.city + ", " + item.state + "-" + item.pincode}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderBillingAddressList = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.addressItemView,
        {
          borderColor:
            billingAddressIndex == index ? Colors.Background : Colors.border,
          backgroundColor:
            billingAddressIndex == index ? Colors.pinkBack : Colors.white,
        },
      ]}
      onPress={() => setBillingAddressIndex(index)}
    >
      <View>
        <Text
          style={styles.addressameText}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {item.name}
        </Text>
        <Text style={styles.addressText1}>{item.full_name}</Text>
        <Text style={styles.addressText1}>
          {item.address_line_1 + ", " + item.address_line_2}
        </Text>
        <Text style={styles.addressText1}>{item.landmark}</Text>
        <Text style={styles.addressText1}>
          {item.city + ", " + item.state + "-" + item.pincode}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} isBack />
      <Loader2 modalVisible={isShowLoader} />
      <Text style={styles.headerText}>{Strings.CheckOut}</Text>
      <ScrollView
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={{}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={cartList}
            renderItem={renderCartItem}
            contentContainerStyle={{
              flex: 1,
              marginHorizontal: Size.FindSize(10),
            }}
            nestedScrollEnabled={false}
            bounces={false}
          />

          <View>
            <View style={styles.rowItem}>
              <CustomText
                name={Strings.ShippingAddress}
                customStyle={{
                  paddingHorizontal: Size.FindSize(5),
                }}
              />
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={addressList}
                horizontal
                renderItem={renderAddressList}
                style={styles.addressList}
                nestedScrollEnabled={false}
                bounces={false}
              />
            </View>
            <View style={styles.rowItem}>
              <CustomText
                name={Strings.BillingAddress}
                customStyle={{
                  paddingHorizontal: Size.FindSize(5),
                  marginTop: Size.FindSize(10),
                }}
              />
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={addressList}
                horizontal
                renderItem={renderBillingAddressList}
                style={styles.addressList}
                nestedScrollEnabled={false}
                bounces={false}
              />
            </View>
            <View style={[styles.cartItem, { marginTop: Size.FindSize(20) }]}>
              <Text style={styles.subTotalText}>{Strings.OrderNotes}</Text>
              <CustomInput
                onChangeText={(text) => setOrderNotes(text)}
                value={orderNotes}
              />
            </View>
            <View style={styles.cartItem}>
              <CustomText
                name={Strings.PaymentMethod}
                customStyle={{
                  paddingHorizontal: Size.FindSize(5),
                  marginTop: Size.FindSize(10),
                }}
              />
              <View
                style={{ flexDirection: "row", marginTop: Size.FindSize(20) }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.addressItemView,
                    {
                      borderColor:
                        paymentMode == 1 ? Colors.Background : Colors.border,
                      backgroundColor:
                        paymentMode == 1 ? Colors.pinkBack : Colors.white,
                    },
                  ]}
                  onPress={() => setPaymentMode(1)}
                >
                  <Text
                    style={[
                      styles.subTotalText,
                      { fontFamily: paymentMode == 1 ? Bold : Regular },
                    ]}
                  >
                    {Strings.Razorpay}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.addressItemView,
                    {
                      borderColor:
                        paymentMode == 2 ? Colors.Background : Colors.border,
                      backgroundColor:
                        paymentMode == 2 ? Colors.pinkBack : Colors.white,
                    },
                  ]}
                  onPress={() => setPaymentMode(2)}
                >
                  <Text
                    style={[
                      styles.subTotalText,
                      { fontFamily: paymentMode == 2 ? Bold : Regular },
                    ]}
                  >
                    {Strings.COD}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.line, { marginTop: Size.FindSize(20) }]} />
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.Subtotal}</Text>
              <Text style={styles.subTotalPrice}>₹{totalPrice}</Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.TaxableAmount}</Text>
              <Text style={styles.subTotalPrice}>₹{totalPrice}</Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.CGST}</Text>
              <Text style={styles.subTotalPrice}>₹{0}</Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.SGST}</Text>
              <Text style={styles.subTotalPrice}>₹{0}</Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.IGST}</Text>
              <Text style={styles.subTotalPrice}>₹{0}</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.subTotalView}>
              <Text
                style={[styles.subTotalText, { fontSize: Size.FindSize(20) }]}
              >
                {Strings.TotalAmount}
              </Text>
              <Text style={styles.TotalPrice}>₹{totalPrice}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkOutView}
              onPress={() => APICallCreateOrder()}
            >
              <Text style={styles.checkOutText}>{Strings.ProceedPayment}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default PaymentOrder;
