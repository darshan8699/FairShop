import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import { Route } from "../../../Navigation/Routes";
import { updateCartList } from "../../../ReduxStore/Actions/cartListAction";
import {
  ADD_TO_CART,
  NO_IMAGE_URL,
  PREF_LOGIN_INFO,
  PREF_STORE_ID,
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
  const [isShowLoader, setLoader] = useState(false);
  const [cartList, setCartList] = useState([]);

  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCGST, setTotalCGST] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const [totalIGST, setTotalIGST] = useState(0);
  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [offerDiscount, setOfferDiscount] = useState(0);

  const [prefStoreId, setPrefStoreId] = useState("");
  const isFirstRun = useRef(true);

  const { cartListReducer } = useSelector((state) => ({
    cartListReducer: state.cartListReducer,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setLoginInfo();
    } else {
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      Logger.log("focus");
      Logger.log("focus.cartList=> ", cartListReducer.cartList);
      if (cartListReducer.cartList.length > 0) {
        let list = cartListReducer.cartList;
        list = list.filter(function (person) {
          return person.quantity != 0;
        });
        setCartList(list);
        updateCartTotal(list);
      }
    });
    return () => unsubscribe();
  }, [props.currentFocus]);

  async function setLoginInfo() {
    const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setPrefStoreId(id);

    const jsonValue = await AsyncStorageLib.getItem(PREF_LOGIN_INFO);
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setLoginData(loginInfo?.item);
    }
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

      const th =
        item.cgst_amount +
        item.sgst_amount +
        (item.igst_amount ? item.igst_amount : 0);

      totalSavings =
        totalSavings + (item.mrp - item.net_price + th) * item.quantity;

      totalAmount =
        discountedSubtotal +
        (item.taxexclusiveof_rsp === "N"
          ? totalCgst - item.cgst_amount
          : totalCgst) +
        (item.taxexclusiveof_rsp === "N"
          ? totalSgst - item.sgst_amount
          : totalSgst) +
        (item.taxexclusiveof_rsp === "N"
          ? totalIgst - (item.igst_amount ? item.igst_amount : 0)
          : totalIgst);
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

  const APICallAddToCart = (product_list) => {
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      product: product_list,
      order_using: "mobile",
      store_id: prefStoreId,
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

  const updateCartData = async (product, quantity) => {
    product.quantity = quantity;

    if (cartListReducer.cartList && cartListReducer.cartList.length > 0) {
      let saveList = cartListReducer.cartList;
      for (const key in saveList) {
        if (saveList.hasOwnProperty(key)) {
          const element = saveList[key];
          if (element.item_code == product.item_code) {
            if (quantity <= parseInt(product.inventory[0].stock_quantity)) {
              saveList[key].quantity = quantity;
            } else {
              showErrorMessage("Stock limit over");
            }
            //saveList[key].quantity = quantity;
          }
        }
      }
      saveList = saveList.filter(function (person) {
        return person.quantity != 0;
      });

      dispatch(updateCartList(saveList));
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
        <View style={styles.countPanelView}>
          <TouchableOpacity
            style={styles.minusButton}
            onPress={() => updateCartData(item, item.quantity - 1)}
          >
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countView} activeOpacity={1}>
            <Text style={styles.countText}>{item.quantity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => updateCartData(item, item.quantity + 1)}
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
      <ScrollView
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
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
        <Text style={styles.summaryText}>{Strings.Summary}</Text>
        <View style={styles.line} />
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>{Strings.Subtotal}</Text>
          <Text style={styles.subTotalPrice}>
            ₹{discountedSubtotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>{Strings.youSave}</Text>
          <Text style={styles.discountText}>₹{totalSavings.toFixed(2)}</Text>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>{Strings.TaxableAmount}</Text>
          <Text style={styles.subTotalPrice}>
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
        <View style={styles.line} />
        <View style={styles.subTotalView}>
          <Text style={[styles.subTotalText, { fontSize: Size.FindSize(20) }]}>
            {Strings.TotalAmount}
          </Text>
          <Text style={styles.TotalPrice}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.checkOutView}
          // onPress={() => checkOutButton()}
          onPress={() => {
            if (totalAmount > 0) Navigator.navigate(Route.PaymentOrder);
          }}
        >
          <Text style={styles.checkOutText}>{Strings.CheckOut}</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* {cartList.length > 0 && (
        <View>
          <View style={styles.subTotalView}>
            <Text style={styles.subTotalText}>{Strings.Subtotal}</Text>
            <Text style={styles.subTotalPrice}>₹{subTotalPrice}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkOutView}
            // onPress={() => checkOutButton()}
            onPress={() => Navigator.navigate(Route.PaymentOrder)}
          >
            <Text style={styles.checkOutText}>{Strings.CheckOut}</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
};

//make this component available to the app
export default MyComponent;
