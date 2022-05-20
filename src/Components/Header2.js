//import liraries
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Images } from "../Assets/images";
import Colors from "../Utility/Colors";
import Logger from "../Utility/Logger";
import { Size } from "../Utility/sizes";
import { Route } from "../Navigation/Routes";
import { Bold, Regular, SemiBold } from "../Assets/fonts";

// create a component
const Header2 = (props) => {
  const { navigation, text } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>

      <TouchableOpacity
        style={styles.iconView}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={Images.close}
          resizeMode={"contain"}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(60),
    //marginBottom: Size.FindSize(10),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Size.FindSize(15),
    borderBottomColor: Colors.headerline,
    borderBottomWidth: Size.FindSize(0.5),
  },
  icon: {
    height: Size.FindSize(15),
    width: Size.FindSize(15),
    alignSelf: "center",
  },
  iconView: {
    alignSelf: "center",
  },
  text: {
    fontFamily: SemiBold,
    fontSize: Size.FindSize(16),
    lineHeight: Size.FindSize(60),
    color: Colors.black,
    alignSelf: "center",
  },
});

//make this component available to the app
export default Header2;
