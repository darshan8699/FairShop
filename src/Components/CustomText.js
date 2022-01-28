//import liraries
import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import { Size } from "../Utility/sizes";
import Colors from "../Utility/Colors";
import { Regular } from "../Assets/fonts";
// create a component
const CustomText = (props) => {
  const { name, starText = true, customStyle } = props;
  return (
    <Text style={[styles.text, { customStyle }]}>
      {name}
      {starText && <Text style={styles.innerText}> *</Text>}
    </Text>
  );
};

// define your styles
const styles = StyleSheet.create({
  innerText: {
    color: Colors.Background,
  },
  text: {
    color: Colors.text,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    marginTop: Size.FindSize(45),
  },
});

//make this component available to the app
export default CustomText;
