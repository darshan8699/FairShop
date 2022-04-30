//import liraries
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import Header2 from "../../../Components/Header2";
import { NO_IMAGE_URL } from "../../../Utility/Constants";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const isFirstRun = useRef(true);
  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setOrderDetails(props.route.params.item);
      Logger.log("OrderData", props.route.params.item);
    }
  });
  const renderItem = ({ item }) => (
    <View style={styles.itemRenderView}>
      <Image
        source={{ uri: item?.images ? item.images[0].url : NO_IMAGE_URL }}
        resizeMode="contain"
        style={styles.itemImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText} ellipsizeMode={"tail"}>
          {item.item_name}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.redText}>{"₹" + item.mrp}</Text>
          {"  x " + item.order_quantity}{" "}
        </Text>
      </View>
      <Text style={styles.redText}>{"₹" + item.subtotal}</Text>
    </View>
  );
  return orderDetails ? (
    <View style={styles.container}>
      <Header2
        navigation={props.navigation}
        text={"Order - " + orderDetails?.tracking_number}
      />
      <ScrollView
        style={{
          paddingBottom: Size.FindSize(20),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.childContainer}>
          <Text
            style={[
              styles.boldText,
              { marginTop: Size.FindSize(10), marginBottom: 0 },
            ]}
          >
            {"Order Placed"}
          </Text>
          <Text style={styles.normalText}>
            {moment(orderDetails?.created_at).format("YYYY-MM-DD hh:mm:ss A")}
          </Text>
          <Text
            style={[
              styles.boldText,
              { marginTop: Size.FindSize(20), marginBottom: 0 },
            ]}
          >
            {"Store"}
          </Text>
          <Text style={styles.normalText}>{orderDetails?.store?.name}</Text>
          <Text
            style={[
              styles.boldText,
              { marginTop: Size.FindSize(20), marginBottom: 0 },
            ]}
          >
            {Strings.ShippingAddress}
          </Text>
          <Text style={styles.greyText}>{orderDetails?.shipping_address}</Text>
          <Text style={[styles.boldText, { marginTop: Size.FindSize(20) }]}>
            {Strings.BillingAddress}
          </Text>
          <Text style={styles.greyText}>{orderDetails?.billing_address}</Text>
          <View style={styles.line} />
          <View style={styles.horizontalView}>
            <Text style={styles.greyText}>{Strings.Subtotal}</Text>
            <Text style={styles.greyText}>
              ₹{orderDetails?.total ? orderDetails.total : 0}
            </Text>
          </View>
          <View style={styles.horizontalView}>
            <Text style={styles.greyText}>{Strings.CGST}</Text>
            <Text style={styles.greyText}>
              ₹{orderDetails?.cgst ? orderDetails.cgst : 0}
            </Text>
          </View>
          <View style={styles.horizontalView}>
            <Text style={styles.greyText}>{Strings.SGST}</Text>
            <Text style={styles.greyText}>
              ₹{orderDetails?.sgst ? orderDetails.sgst : 0}
            </Text>
          </View>
          <View style={styles.horizontalView}>
            <Text style={styles.greyText}>{Strings.IGST}</Text>
            <Text style={styles.greyText}>
              ₹{orderDetails?.igst ? orderDetails.igst : 0}
            </Text>
          </View>
          <View style={styles.horizontalView}>
            <Text style={styles.boldText}>{Strings.Total}</Text>
            <Text style={styles.redText}>
              ₹{orderDetails?.total ? orderDetails.total : 0}
            </Text>
          </View>
        </View>
        <View style={styles.itemView}>
          <Text style={[styles.boldText, { alignSelf: "center" }]}>
            {Strings.Item}
          </Text>
          <Text style={[styles.boldText, { alignSelf: "center" }]}>
            {Strings.Price}
          </Text>
        </View>
        <FlatList
          data={orderDetails?.order_product}
          renderItem={renderItem}
          nestedScrollEnabled={false}
        />
        <View
          style={[styles.childContainer, { paddingBottom: Size.FindSize(35) }]}
        >
          {orderDetails?.order_notes && (
            <Text
              style={[
                styles.boldText,
                { marginTop: Size.FindSize(20), marginBottom: 0 },
              ]}
            >
              {"Notes\n"}
              <Text style={styles.normalText}>{orderDetails?.order_notes}</Text>
            </Text>
          )}

          <Text
            style={[
              styles.boldText,
              { marginTop: Size.FindSize(20), marginBottom: 0 },
            ]}
          >
            {Strings.PaymentMethod}
          </Text>
          <Text style={styles.normalText}>
            {orderDetails?.payment_gateway == "cod"
              ? "Cash on Delivery"
              : Strings.Razorpay}
          </Text>
          {orderDetails?.razorpay_order_id && (
            <Text style={styles.smallText}>
              {Strings.Order_id + orderDetails?.razorpay_order_id}
            </Text>
          )}
          {orderDetails?.razorpay_payment_id && (
            <Text style={styles.smallText}>
              {Strings.Payment_id +
                "" +
                (orderDetails?.razorpay_payment_id
                  ? orderDetails?.razorpay_payment_id
                  : "")}
            </Text>
          )}
          <Text
            style={[
              styles.boldText,
              { marginTop: Size.FindSize(20), marginBottom: 0 },
            ]}
          >
            {Strings.OtherDetails}
          </Text>
          <Text style={styles.normalText}>{"Order Using"}</Text>
          <Text style={styles.smallText}>{orderDetails?.order_using}</Text>
        </View>
      </ScrollView>
    </View>
  ) : null;
};

//make this component available to the app
export default MyComponent;
