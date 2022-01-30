//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { ORDERS } from "../../../Utility/Constants";
import {
  showErrorMessage,
  validateResponse,
  getFormatedate,
} from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyOrder = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [offersList, setOffersList] = useState([]);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallWishList();
    }
  });

  const APICallWishList = () => {
    setLoader(true);
    const apiClass = new APICallService(ORDERS, { limit: 10 });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setOffersList(res.data?.data);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <Text style={styles.headerText}>{Strings.My_Order}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: Size.FindSize(15) }}
        data={offersList}
        renderItem={({ item }) => (
          <View style={styles.listView}>
            <View style={{ flex: 1, marginStart: Size.FindSize(10) }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.ShopNameText}>Order #{item.id}</Text>
                <Text style={styles.text1}>
                  {item.status == "PAYMENT_FAILED"
                    ? "Payment Failed"
                    : item.status == "ORDER_RECEIVED"
                    ? "Order Received"
                    : item.status == "PAYMENT_PENDING"
                    ? "Payment Pending"
                    : ""}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: Size.FindSize(2),
                }}
              >
                <Text style={styles.text1}>Order Date</Text>
                <Text style={styles.text1}>
                  {getFormatedate(item.created_at, "YYYY-MM-DD")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: Size.FindSize(2),
                }}
              >
                <Text style={styles.text1}>Amount</Text>
                <Text style={styles.priceText}>₹{item.total}</Text>
              </View>
            </View>
          </View>
        )}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

//make this component available to the app
export default MyOrder;
