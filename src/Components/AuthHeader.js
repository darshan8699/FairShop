//import liraries
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Images } from "../Assets/images";
import { Size } from "../Utility/sizes";

// create a component
const AuthHeader = (props) => {
  const { isBack = false, navigation, isRightIcon = true } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconView}
        onPress={() => {
          if (isBack) navigation.goBack();
        }}
      >
        <Image
          source={isBack ? Images.back : null}
          resizeMode={"contain"}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Image
        source={Images.headerLogo}
        resizeMode={"contain"}
        style={styles.logo}
      />
      <Image resizeMode={"contain"} style={styles.icon} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(70),
    marginBottom: Size.FindSize(10),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    height: Size.FindSize(70),
    width: Size.FindSize(220),
    justifyContent: "center",
    alignSelf: "center",
  },
  icon: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
    alignSelf: "center",
  },
  iconView: {
    alignSelf: "center",
  },
});

//make this component available to the app
export default AuthHeader;
