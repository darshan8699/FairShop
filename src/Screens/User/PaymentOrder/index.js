import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
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
import Colors from "../../../Utility/Colors";
import {
  ADD_TO_CART,
  MY_ADDRESS,
  NO_IMAGE_URL,
  PAYMENT_VERIFY,
  PREF_LOGIN_INFO,
} from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty } from "../../../Utility/Validation";
import styles from "./styles";

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
      APICallGetAddressData();
    }
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

  const APICalladdToCart = (product_item_code, quantity) => {
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

  const APICallVerifyPayament = (
    order_id,
    payment_status,
    razorpay_order_id,
    razorpay_payment_id
  ) => {
    setLoader(true);
    const apiClass = new APICallService(PAYMENT_VERIFY, {
      order_id: order_id,
      payment_status: payment_status,
      razorpay_data: {
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature:
          "89b0863d1089dbd97b999f499010c9db26634de0ce34b9aa639c90dde7265b2c",
      },
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          APICallCartList(loginData);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const proceedToPayment = () => {
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
    var options = {
      // description: "PSO WHOLE WHEAT CHAKKI ATTA- POUCH 2Kg",
      image: "https://fairshop.co.in/assets/images/fairshop-logo.svg",
      currency: "INR",
      key: "rzp_test_KcH2iILATfSbfc",
      amount: "" + totalPrice,
      // name: "ALF-FARMS CHICKEN BACON150gm",
      // order_id: "order_IpD8fVMwrQSonX", //Replace this with an order_id created using Orders API.
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
        alert(`Success: ${data.razorpay_payment_id}`);
        APICallVerifyPayament(data.razorpay_payment_id);
      })
      .catch((error) => {
        // handle failure
        Logger.log(error);
        alert(`Error: ${error.code} | ${error.description}`);
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
            onPress={() => APICalladdToCart(item.item_code, item.quantity - 1)}
          >
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countView} activeOpacity={1}>
            <Text style={styles.countText}>{item.quantity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => APICalladdToCart(item.item_code, item.quantity + 1)}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.priceText2}>₹{item.net_price}</Text>
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
              onPress={() => proceedToPayment()}
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
