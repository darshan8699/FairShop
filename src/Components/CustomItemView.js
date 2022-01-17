//import liraries
import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Size } from "../Utility/sizes";
import { Regular } from "../Assets/fonts";
import Colors from "../Utility/Colors";
import { Images } from "../Assets/images";
import Strings from "../Utility/Strings";

// create a component
const CustomItemView = (props) => {
  return (
    <TouchableOpacity style={[styles.list, props.listView]} activeOpacity={1}>
      <Image
        source={{
          // uri:props?.item?.images[0].url
          uri: "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
        }}
        resizeMode="contain"
        style={styles.item}
      />
      <TouchableOpacity style={styles.favView}>
        <Image source={Images.fav} resizeMode="contain" style={styles.fav} />
      </TouchableOpacity>
      <View style={styles.flagView}>
        <Image source={Images.flag} resizeMode="contain" style={styles.flag} />
        <Image
          source={props.item.veg_non_veg ? Images.nonveg : Images.veg}
          resizeMode="contain"
          style={styles.veg}
        />
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode={"tail"}>
        {props.item.item_name}
      </Text>
      <Text style={styles.price}>₹{props.item.mrp}</Text>
      <TouchableOpacity
        style={styles.cartView}
        onPress={() => console.log("item is :", props.item)}
      >
        <Image source={Images.cart} resizeMode="contain" style={styles.cart} />
        <Text style={styles.add}>{Strings.Add}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  list: {
    height: Size.FindSize(261),
    width: Size.FindSize(180),
    backgroundColor: Colors.white,
    marginLeft: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    marginTop: Size.FindSize(15),
  },
  item: {
    height: Size.FindSize(100),
    width: Size.FindSize(180),
    alignSelf: "center",
    borderTopLeftRadius: Size.FindSize(10),
    borderTopRightRadius: Size.FindSize(10),
  },
  favView: {
    position: "absolute",
    right: Size.FindSize(7),
    top: Size.FindSize(7),
  },
  fav: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
  },
  flag: {
    height: Size.FindSize(17),
    width: Size.FindSize(17),
  },
  veg: {
    height: Size.FindSize(17),
    width: Size.FindSize(17),
    marginLeft: Size.FindSize(7),
  },
  flagView: {
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: Size.FindSize(7),
    marginTop: Size.FindSize(3),
  },
  name: {
    fontFamily: Regular,
    fontSize: Size.FindSize(16),
    color: Colors.headerText,
    marginHorizontal: Size.FindSize(10),
    marginTop: Size.FindSize(15),
  },
  price: {
    fontFamily: Regular,
    fontSize: Size.FindSize(18),
    color: Colors.Background,
    marginHorizontal: Size.FindSize(10),
  },
  cartView: {
    marginHorizontal: Size.FindSize(10),
    borderWidth: 1,
    borderColor: Colors.Background,
    borderRadius: Size.FindSize(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(42),
    marginTop: Size.FindSize(15),
  },
  cart: {
    height: Size.FindSize(20),
    width: Size.FindSize(20),
    tintColor: Colors.Background,
  },
  add: {
    marginLeft: Size.FindSize(5),
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(16),
    alignSelf: "center",
  },
});

//make this component available to the app
export default CustomItemView;
