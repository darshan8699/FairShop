//import liraries
import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Size } from "../Utility/sizes";
import { Images } from "../Assets/images";

// create a component
const Header = (props) => {
  return (
    <View style={styles.container}>
      <Image source={Images.menu} resizeMode={"contain"} style={styles.icon} />
      <Image
        source={Images.headerLogo}
        resizeMode={"contain"}
        style={styles.logo}
      />
      <Image
        source={Images.location}
        resizeMode={"contain"}
        style={styles.icon}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(50),
    marginVertical: Size.FindSize(10),
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: Size.FindSize(20),
  },
  logo: {
    height: Size.FindSize(70),
    top: 0,
    position: "absolute",
    left: Size.FindSize(-135),
  },
  icon: {
    height: Size.FindSize(30),
    width: Size.FindSize(30),
    alignSelf: "center",
  },
});

//make this component available to the app
export default Header;
