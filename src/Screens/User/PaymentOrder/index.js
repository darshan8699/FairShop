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
  TextInput,
  Platform,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { ScrollView } from "react-native-gesture-handler";
import RazorpayCheckout from "react-native-razorpay";
import APICallService from "../../../API/APICallService";
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
  PROMOCODE_VERIFY,
  UPDATE_CART_COUNT,
  STORE_DETAILS,
} from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty, validateEmail } from "../../../Utility/Validation";
import styles from "./styles";
import Navigator from "../../../Utility/Navigator";
import { Route } from "../../../Navigation/Routes";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Images } from "../../../Assets/images";

// create a component
const PaymentOrder = (props) => {
  const [loginData, setLoginData] = useState("");
  const [storeId, setStoreId] = useState("");

  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCGST, setTotalCGST] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalIGST, setTotalIGST] = useState(0);
  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [offerDiscount, setOfferDiscount] = useState(0);

  const [isShowLoader, setLoader] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [servicablePincode, setServicablePincode] = useState([]);
  const [shippingPinCodeError, setShippingPinCodeError] = useState(true);
  const [orderNotes, setOrderNotes] = useState("");
  const [addressIndex, setAddressIndex] = useState(null);
  const [billingAddressIndex, setBillingAddressIndex] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);

  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingFullName, setShippingFullName] = useState("");
  const [shippingContact, setShippingContact] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");

  const [billingAddress, setBillingAddress] = useState("");
  const [billingFullName, setBillingFullName] = useState("");
  const [billingContact, setBillingContact] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPincode, setBillingPincode] = useState("");
  const [promoCode, setPromocode] = useState("");
  const isFirstRun = useRef(true);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setLoginInfo();
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
      APICallGetAddressData();
    }
    const store_id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setStoreId(store_id);
    APICallGetStoreInfo(store_id);
    getCartList();
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
    let cartSubtotal = 0;
    let discountedSubtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalSavings = 0;
    let totalAmount = 0;
    let offerDiscount = 0;

    cartList.map((item) => {
      Logger.log(item);
      totalCgst =
        totalCgst + (item.cgst_amount ? item.cgst_amount : 0) * item.quantity;
      totalSgst =
        totalSgst + (item.sgst_amount ? item.sgst_amount : 0) * item.quantity;
      totalIgst =
        totalIgst + (item.igst_amount ? item.igst_amount : 0) * item.quantity;

      cartSubtotal = cartSubtotal + item.mrp * item.quantity;
      discountedSubtotal = discountedSubtotal + item.net_price * item.quantity;
      totalSavings =
        totalSavings +
        (item.mrp -
          item.net_price +
          item.cgst_amount +
          item.sgst_amount +
          (item.igst_amount ? item.igst_amount : 0)) *
          item.quantity;
      Logger.log(item.igst_amount + " " + item.quantity);
      totalAmount = discountedSubtotal + totalCgst + totalSgst + totalIgst;
    });

    setTotalAmount(totalAmount);
    setSubTotalPrice(cartSubtotal);
    setTotalCGST(totalCgst);
    setTotalSGST(totalSgst);
    setTotalIGST(totalIgst);
    setTotalSavings(totalSavings);
    setDiscountedSubtotal(discountedSubtotal);
    setOfferDiscount(offerDiscount);
  }

  const APICallGetStoreInfo = (store_id) => {
    setLoader(true);
    const apiClass = new APICallService(STORE_DETAILS, store_id);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setServicablePincode(res.data.item.servicable_pincodes);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallGetAddressData = () => {
    setLoader(true);
    const apiClass = new APICallService(MY_ADDRESS, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("address res.data:-", res.data);
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
      order_using: "mobile",
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
      order_using: "mobile",
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
    razorpay_signature,
    tracking_number
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
          const list = [];
          AsyncStorageLib.setItem(ALL_CART, JSON.stringify(list));
          EventRegister.emit(UPDATE_CART_COUNT, 0);
          //props.navigation.goBack();
          Navigator.navigate(Route.OrderSuccess, {
            order_id: order_id,
            tracking_number: tracking_number,
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const onSubmitPromocode = async () => {
    Keyboard.dismiss();

    const apiClass = new APICallService(PROMOCODE_VERIFY, {
      store_id: storeId,
      coupon_code: promoCode,
      product: cartList.map((x) => {
        return {
          product_item_code: x.item_code,
          quantity: x.quantity,
        };
      }),
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
        } else {
          showErrorMessage(res.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallCreateOrder = async () => {
    Keyboard.dismiss();
    if (loginData) {
      if (addressIndex == null) {
        showErrorMessage(Strings.error_Address);
        return;
      } else if (billingAddressIndex == null) {
        showErrorMessage(Strings.error_BillingAddress);
        return;
      }
    } else {
      if (!isTextNotEmpty(shippingFullName)) {
        showErrorMessage(Strings.error_receiver_name);
        return;
      } else if (!isTextNotEmpty(shippingContact)) {
        showErrorMessage(Strings.error_contact_no);
        return;
      } else if (!isTextNotEmpty(shippingEmail)) {
        showErrorMessage(Strings.error_email);
        return;
      } else if (!validateEmail(shippingEmail)) {
        showErrorMessage(Strings.error_valid_email);
        return;
      } else if (!isTextNotEmpty(shippingAddress)) {
        showErrorMessage(Strings.error_address);
        return;
      } else if (!isTextNotEmpty(shippingCity)) {
        showErrorMessage(Strings.error_city);
        return;
      } else if (!isTextNotEmpty(shippingState)) {
        showErrorMessage(Strings.error_State);
        return;
      } else if (!isTextNotEmpty(shippingPincode)) {
        showErrorMessage(Strings.error_pincode);
        return;
      } else if (!isTextNotEmpty(billingFullName)) {
        showErrorMessage(Strings.error_receiver_name);
        return;
      } else if (!isTextNotEmpty(billingContact)) {
        showErrorMessage(Strings.error_contact_no);
        return;
      } else if (!isTextNotEmpty(billingEmail)) {
        showErrorMessage(Strings.error_email);
        return;
      } else if (!validateEmail(billingEmail)) {
        showErrorMessage(Strings.error_valid_email);
        return;
      } else if (!isTextNotEmpty(billingAddress)) {
        showErrorMessage(Strings.error_BillingAddress);
        return;
      } else if (!isTextNotEmpty(billingCity)) {
        showErrorMessage(Strings.error_city);
        return;
      } else if (!isTextNotEmpty(billingState)) {
        showErrorMessage(Strings.error_State);
        return;
      } else if (!isTextNotEmpty(billingPincode)) {
        showErrorMessage(Strings.error_pincode);
        return;
      }
    }
    if (!shippingPinCodeError) {
      showErrorMessage(Strings.error_store_pincode);
      return;
    }
    if (paymentMode == null) {
      showErrorMessage(Strings.error_paymentMode);
      return;
    }

    setLoader(true);
    let redAddress;
    if (loginData) {
      redAddress =
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
    } else {
      redAddress =
        shippingFullName +
        ", " +
        shippingContact +
        ", " +
        shippingEmail +
        ", " +
        shippingAddress +
        ", " +
        shippingCity +
        ", " +
        shippingState +
        " " +
        shippingPincode;
    }
    let fullBillingAddress;
    if (loginData) {
      fullBillingAddress =
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
    } else {
      fullBillingAddress =
        billingFullName +
        ", " +
        billingContact +
        ", " +
        billingEmail +
        ", " +
        billingAddress +
        ", " +
        billingCity +
        ", " +
        billingState +
        " " +
        billingPincode;
    }
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
      order_using: "mobile",
      store_id: storeId,
      customer_contact: loginData?.phone ? loginData?.phone : billingContact,
      payment_gateway: paymentMode == 1 ? "razorpay" : "cod",
      shipping_address: redAddress,
      billing_address: fullBillingAddress,
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
            const list = [];
            AsyncStorageLib.setItem(ALL_CART, JSON.stringify(list));
            EventRegister.emit(UPDATE_CART_COUNT, 0);
            //props.navigation.goBack();
            Navigator.navigate(Route.OrderSuccess, {
              order_id: res?.data?.item?.id,
              tracking_number: res?.data?.item?.tracking_number,
            });
          } else {
            proceedToPayment(
              res?.data?.item?.id,
              res?.data?.item?.razorpay_order_id,
              res?.data?.item?.tracking_number
            );
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const proceedToPayment = (order_id, razorpay_order_id, tracking_number) => {
    var options = {
      name: "FairShop",
      // description: "PSO WHOLE WHEAT CHAKKI ATTA- POUCH 2Kg",
      image: "https://fairshop.co.in/assets/images/fairshop-logo.svg",
      currency: "INR",
      key: "rzp_test_KcH2iILATfSbfc",
      amount: totalAmount + "00",
      // name: "ALF-FARMS CHICKEN BACON150gm",
      order_id: razorpay_order_id, //Replace this with an order_id created using Orders API.
      prefill: {
        email: loginData?.email ? loginData?.email : "",
        // shippingContact: loginData?.phone ? "+91" + loginData?.phone : "",
        contact: loginData?.phone ? "+91" + loginData?.phone : "",
        name: loginData
          ? loginData?.profile?.first_name + " " + loginData?.profile?.last_name
          : billingFullName,
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
          data?.razorpay_signature,
          tracking_number
        );
      })
      .catch((error) => {
        // handle failure
        Logger.log("error:-", error);
        if (Platform.OS == "ios") {
          Alert.alert("", `${error.description}`);
        } else {
          Alert.alert("", "Payment cancelled by user");
        }
      });
  };

  const renderCartItem = ({ item }) => (
    <View style={{}}>
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
            {/* <Text style={styles.quantityText}>{item.quantity}</Text> */}
            {item.rsp < item.mrp ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.priceText}>₹{item.rsp}</Text>
                <Text style={styles.priceText1}>₹{item.mrp}</Text>
              </View>
            ) : (
              <Text style={styles.priceText}>₹{item.mrp}</Text>
            )}
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
        <Text style={styles.priceText2}>₹{item.rsp * item.quantity}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );

  const renderAddressList = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.addressItemView,
        {
          borderColor:
            addressIndex == index ? Colors.Background : Colors.button,
          backgroundColor:
            addressIndex == index ? Colors.pinkBack : Colors.white,
        },
      ]}
      onPress={() => {
        setAddressIndex(index);
        setShippingPinCodeError(servicablePincode.includes("" + item.pincode));
      }}
    >
      <View style={styles.nameView}>
        <View style={styles.backView}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text
          style={styles.addressameText}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {item.name}
        </Text>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Navigator.navigate(Route.Address, { updateDetails: item.id })
            }
          >
            <Image
              source={Images.pencil}
              resizeMode={"contain"}
              style={styles.editIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(Strings.Delete_address_alert, null, [
                {
                  text: Strings.Ok,
                  onPress: () => {
                    deleteAddress(item.id);
                  },
                },
                {
                  text: Strings.Cancel,
                  onPress: () => {},
                },
              ]);
            }}
          >
            <Image
              source={Images.delete}
              resizeMode={"contain"}
              style={styles.icon1}
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.infoView}>
        <View style={styles.userView}>
          <Image
            source={Images.profile}
            resizeMode={"contain"}
            style={styles.usericon}
          />
          <Text style={styles.text1}>{item.full_name}</Text>
        </View>
        <View style={styles.userView}>
          <Image
            source={Images.call}
            resizeMode={"contain"}
            style={styles.usericon}
          />
          <Text style={styles.text1}>{item.phone}</Text>
        </View>
      </View>
      <Text style={styles.text1}>{item.address_line_1}</Text>
      <Text style={styles.text1}>{item.address_line_2}</Text>
      <Text style={styles.text1}>{item.landmark}</Text>
      <Text style={styles.text1}>
        {item.city + ", " + item.state + "-" + item.pincode}
      </Text>
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
      <View style={styles.nameView}>
        <View style={styles.backView}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text
          style={styles.addressameText}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {item.name}
        </Text>
      </View>
      <View style={styles.infoView}>
        <View style={styles.userView}>
          <Image
            source={Images.profile}
            resizeMode={"contain"}
            style={styles.usericon}
          />
          <Text style={styles.text1}>{item.full_name}</Text>
        </View>
        <View style={styles.userView}>
          <Image
            source={Images.call}
            resizeMode={"contain"}
            style={styles.usericon}
          />
          <Text style={styles.text1}>{item.phone}</Text>
        </View>
      </View>
      <Text style={styles.text1}>{item.address_line_1}</Text>
      <Text style={styles.text1}>{item.address_line_2}</Text>
      <Text style={styles.text1}>{item.landmark}</Text>
      <Text style={styles.text1}>
        {item.city + ", " + item.state + "-" + item.pincode}
      </Text>
    </TouchableOpacity>
  );

  const renderShippingAddress = () => (
    <View
      style={{
        backgroundColor: Colors.line,
        paddingBottom: Size.FindSize(15),
        paddingHorizontal: Size.FindSize(10),
        marginTop: Size.FindSize(10),
      }}
    >
      <CustomText name={Strings.Receiver_name} marginTop={Size.FindSize(15)} />
      <CustomInput
        onChangeText={(text) => setShippingFullName(text)}
        value={shippingFullName}
      />

      <CustomText name={Strings.Contact_No} marginTop={Size.FindSize(25)} />
      <CustomInput
        onChangeText={(text) => setShippingContact(text)}
        value={shippingContact}
        keyboardType="numeric"
        placeHolder={"+91"}
        isPhone
      />
      <CustomText name={Strings.Email} marginTop={Size.FindSize(25)} />
      <CustomInput
        onChangeText={(text) => setShippingEmail(text)}
        keyboardType={"email-address"}
        autoCapitalize={"none"}
        value={shippingEmail}
      />
      <CustomText name={Strings.Address} marginTop={Size.FindSize(25)} />
      <CustomInput
        onChangeText={(text) => setShippingAddress(text)}
        value={shippingAddress}
      />
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <CustomText name={Strings.City} marginTop={Size.FindSize(25)} />
          <CustomInput
            onChangeText={(text) => setShippingCity(text)}
            value={shippingCity}
          />
        </View>
        <View style={{ width: Size.FindSize(5) }} />
        <View style={{ flex: 1 }}>
          <CustomText name={Strings.State} marginTop={Size.FindSize(25)} />
          <CustomInput
            onChangeText={(text) => setShippingState(text)}
            value={shippingState}
          />
        </View>
        <View style={{ width: Size.FindSize(5) }} />
        <View style={{ flex: 1 }}>
          <CustomText name={Strings.Pincode} marginTop={Size.FindSize(25)} />
          <CustomInput
            onChangeText={(text) => {
              setShippingPincode(text);
              if (text.trim().length == 6) {
                setShippingPinCodeError(
                  servicablePincode.includes(text.trim())
                );
              }
            }}
            value={shippingPincode}
            keyboardType="numeric"
            inputStyle={{
              borderWidth: !shippingPinCodeError ? 1 : 0,
              borderColor: Colors.red,
            }}
          />
          {!shippingPinCodeError ? (
            <CustomText
              color={Colors.red}
              name={Strings.error_store_pincode}
              marginTop={Size.FindSize(15)}
              starText={false}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
  const renderBillingAddress = () => (
    <View
      style={{
        backgroundColor: Colors.line,
        paddingBottom: Size.FindSize(15),
        paddingHorizontal: Size.FindSize(10),
        marginTop: Size.FindSize(10),
      }}
    >
      <CustomText name={Strings.Receiver_name} marginTop={Size.FindSize(15)} />
      <CustomInput
        onChangeText={(text) => setBillingFullName(text)}
        value={billingFullName}
      />

      <CustomText name={Strings.Contact_No} marginTop={Size.FindSize(25)} />
      <CustomInput
        onChangeText={(text) => setBillingContact(text)}
        value={billingContact}
        keyboardType="numeric"
        placeHolder={"+91"}
        isPhone
      />
      <CustomText name={Strings.Email} marginTop={Size.FindSize(25)} />
      <CustomInput
        onChangeText={(text) => setBillingEmail(text)}
        keyboardType={"email-address"}
        autoCapitalize={"none"}
        value={billingEmail}
      />
      <CustomText name={Strings.Address} marginTop={Size.FindSize(25)} />
      <CustomInput
        onChangeText={(text) => setBillingAddress(text)}
        value={billingAddress}
      />
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <CustomText name={Strings.City} marginTop={Size.FindSize(25)} />
          <CustomInput
            onChangeText={(text) => setBillingCity(text)}
            value={billingCity}
          />
        </View>
        <View style={{ width: Size.FindSize(5) }} />
        <View style={{ flex: 1 }}>
          <CustomText name={Strings.State} marginTop={Size.FindSize(25)} />
          <CustomInput
            onChangeText={(text) => setBillingState(text)}
            value={billingState}
          />
        </View>
        <View style={{ width: Size.FindSize(5) }} />
        <View style={{ flex: 1 }}>
          <CustomText name={Strings.Pincode} marginTop={Size.FindSize(25)} />
          <CustomInput
            onChangeText={(text) => setBillingPincode(text)}
            value={billingPincode}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isRightIcon={false} isBack /> */}
      <Loader2 modalVisible={isShowLoader} />
      <KeyboardAwareScrollView
        overScrollMode="never"
        bounces={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          overflow: "hidden",
        }}
      >
        <View style={{}}>
          <Text style={styles.headerText}>{Strings.CheckOut}</Text>
          {/* <FlatList
            showsVerticalScrollIndicator={false}
            data={cartList}
            renderItem={renderCartItem}
            contentContainerStyle={{
              flex: 1,
              marginHorizontal: Size.FindSize(10),
            }}
            nestedScrollEnabled={false}
            bounces={false}
          /> */}

          <View style={{}}>
            <View style={styles.rowItem}>
              <CustomText
                name={Strings.ShippingAddress}
                customStyle={{
                  paddingHorizontal: Size.FindSize(5),
                }}
                marginTop={Size.FindSize(25)}
              />
              {addressList.length > 0 && (
                <View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={addressList}
                    horizontal
                    renderItem={renderAddressList}
                    style={styles.addressList}
                    nestedScrollEnabled={false}
                    bounces={false}
                  />
                  {!shippingPinCodeError ? (
                    <CustomText
                      color={Colors.red}
                      name={Strings.error_store_pincode}
                      marginTop={Size.FindSize(15)}
                      starText={false}
                    />
                  ) : null}
                </View>
              )}

              {loginData ? null : renderShippingAddress()}
            </View>
            <View style={styles.rowItem}>
              <CustomText
                name={Strings.BillingAddress}
                customStyle={{
                  paddingHorizontal: Size.FindSize(5),
                }}
              />
              {addressList.length > 0 && (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={addressList}
                  horizontal
                  renderItem={renderBillingAddressList}
                  style={styles.addressList}
                  nestedScrollEnabled={false}
                  bounces={false}
                />
              )}
              {loginData ? null : renderBillingAddress()}
            </View>
            <View
              style={[
                styles.cartItem,
                {
                  marginTop: Size.FindSize(20),
                  marginHorizontal: Size.FindSize(5),
                },
              ]}
            >
              {/* <Text style={styles.subTotalText}>{Strings.OrderNotes}</Text> */}
              <CustomText
                name={Strings.OrderNotes}
                marginTop={Size.FindSize(10)}
                starText={false}
              />
              <CustomInput
                onChangeText={(text) => setOrderNotes(text)}
                value={orderNotes}
              />
            </View>
            <View
              style={[styles.cartItem, { marginHorizontal: Size.FindSize(5) }]}
            >
              <CustomText
                name={Strings.PaymentMethod}
                customStyle={{
                  paddingHorizontal: Size.FindSize(5),
                }}
                marginTop={Size.FindSize(10)}
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
                        paymentMode == 1 ? Colors.pinkBack : Colors.line,
                    },
                  ]}
                  onPress={() => setPaymentMode(1)}
                >
                  <Text
                    style={[
                      styles.subTotalText,
                      {
                        color:
                          paymentMode == 1
                            ? Colors.Background
                            : Colors.headerText,
                      },
                    ]}
                  >
                    {Strings.CardUPIWallet}
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
                        paymentMode == 2 ? Colors.pinkBack : Colors.line,
                    },
                  ]}
                  onPress={() => setPaymentMode(2)}
                >
                  <Text
                    style={[
                      styles.subTotalText,
                      {
                        color:
                          paymentMode == 2
                            ? Colors.Background
                            : Colors.headerText,
                      },
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
              <Text style={styles.subTotalPrice}>
                ₹{discountedSubtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.youSave}</Text>
              <Text style={styles.discountText}>
                ₹{totalSavings.toFixed(2)}
              </Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.TaxableAmount}</Text>
              <Text style={styles.subTotalPrice}>
                {" "}
                ₹{(subTotalPrice - totalSavings).toFixed(2)}
              </Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.CGST}</Text>
              <Text style={styles.subTotalPrice}>₹{totalCGST.toFixed(2)}</Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.SGST}</Text>
              <Text style={styles.subTotalPrice}>₹{totalSGST.toFixed(2)}</Text>
            </View>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>{Strings.IGST}</Text>
              <Text style={styles.subTotalPrice}>₹{totalIGST.toFixed(2)}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: Size.FindSize(15),
                marginVertical: Size.FindSize(10),
              }}
            >
              <TextInput
                style={styles.promocodeInput}
                placeholder={"Enter Promocode"}
                onChangeText={(text) => setPromocode(text)}
                value={promoCode}
              />
              <TouchableOpacity
                style={styles.applyButton}
                disabled={promoCode.trim().length == 0}
                onPress={() => onSubmitPromocode()}
              >
                <Text style={styles.applyText}>{Strings.Apply}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.subTotalView}>
              <Text
                style={[styles.subTotalText, { fontSize: Size.FindSize(20) }]}
              >
                {Strings.TotalAmount}
              </Text>
              <Text style={styles.TotalPrice}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkOutView}
              onPress={() => APICallCreateOrder()}
            >
              <Text style={styles.checkOutText}>{Strings.ProceedPayment}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

//make this component available to the app
export default PaymentOrder;
