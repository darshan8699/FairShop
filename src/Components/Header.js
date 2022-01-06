//import liraries
import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Size } from "../Utility/sizes";
import { Images } from "../Assets/images";
import Colors from "../Utility/Colors";

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
    height: Size.FindSize(60),
    marginBottom: Size.FindSize(10),
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: Size.FindSize(15),
    borderBottomColor: Colors.headerline,
    borderBottomWidth: Size.FindSize(0.5),
  },
  logo: {
    height: Size.FindSize(70),
    top: 0,
    position: "absolute",
    left: Size.FindSize(-135),
  },
  icon: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
    alignSelf: "center",
  },
});

//make this component available to the app
export default Header;
