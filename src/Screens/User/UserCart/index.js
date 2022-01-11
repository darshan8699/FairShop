//import liraries
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import { Images } from "../../../Assets/images";

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
  const renderCartItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <View style={{ flexDirection: "row" }}>
          <Image resizeMode="contain" source={item.image} style={styles.icon} />
          <View style={styles.textView}>
            <Text style={styles.item}>{item.itemName}</Text>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
        </View>
        <View style={styles.countPanelView}>
          <TouchableOpacity style={styles.minusButton}>
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countView} activeOpacity={1}>
            <Text style={styles.countText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusButton}>
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
        data={cartData}
        renderItem={renderCartItem}
      />
      <View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>{Strings.Subtotal}</Text>
          <Text style={styles.subTotalPrice}>₹{"1400"}</Text>
        </View>
        <TouchableOpacity style={styles.checkOutView}>
          <Text style={styles.checkOutText}>{Strings.CheckOut}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
