//import liraries
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, FlatList, Image } from "react-native";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import Header2 from "../../../Components/Header2";
import { NO_IMAGE_URL } from "../../../Utility/Constants";

// create a component
const MyComponent = (props) => {
  const isFirstRun = useRef(true);
  const [orderDetails, setOrderDetails] = useState(props.route.params.item);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    }
  });
  const renderItem = ({ item }) => (
    <View style={styles.itemRenderView}>
      <Image
        source={{ uri: item?.images ? item.images[0].url : NO_IMAGE_URL }}
        resizeMode="contain"
        style={styles.itemImage}
      />
      <View>
        <Text style={styles.itemText} numberOfLines={1} ellipsizeMode={"tail"}>
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
  return (
    <View style={styles.container}>
      <Header2
        navigation={props.navigation}
        text={"Order - " + orderDetails?.tracking_number}
      />
      <ScrollView
        style={{
          marginBottom: Size.FindSize(20),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.childContainer}>
          <Text style={styles.boldText}>{Strings.ShippingAddress}</Text>
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
          <Text>{Strings.Item}</Text>
        </View>
        <FlatList
          data={orderDetails?.order_product}
          renderItem={renderItem}
          nestedScrollEnabled={false}
        />
        <View
          style={[styles.childContainer, { paddingBottom: Size.FindSize(35) }]}
        >
          <Text style={[styles.boldText, { marginTop: Size.FindSize(20) }]}>
            {Strings.PaymentMethod}
          </Text>
          <Text style={styles.normalText}>{Strings.Razorpay}</Text>
          <Text style={styles.smallText}>
            {Strings.Order_id + orderDetails?.razorpay_order_id}
          </Text>
          <Text style={styles.smallText}>
            {Strings.Payment_id + orderDetails?.razorpay_payment_id}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
