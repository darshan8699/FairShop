import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Bold, Regular } from "../Assets/fonts";
import Colors from "../Utility/Colors";
import { Size } from "../Utility/sizes";

const CustomNetBotton = (props) => {
  const {
    onPress = () => {},
    title = "",
    isStroke,
    height = Size.FindSize(55),
    minWidth = Size.width - Size.FindSize(140),
    disabled = false,
    textStyle = {},
    containerStyle = {},
    buttonDisable,
  } = props;

  return (
    <TouchableOpacity
      disabled={buttonDisable}
      activeOpacity={1}
      style={[
        styles.container,
        {
          backgroundColor: isStroke
            ? Colors.white
            : buttonDisable
            ? Colors.loginText
            : Colors.button,
          borderColor: buttonDisable ? Colors.loginText : Colors.Background,
          overflow: "hidden",
        },
        containerStyle,
      ]}
      onPress={!disabled && onPress}
    >
      <View
        style={{
          flexDirection: "row",
          overflow: "hidden",
          minWidth: minWidth,
          alignItems: "center",
          justifyContent: "center",
          height: height,
          paddingRight: Size.FindSize(20),
          paddingLeft: Size.FindSize(20),
        }}
      >
        <Text
          style={[
            styles.text,
            {
              color: isStroke ? Colors.Background : "white",
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomNetBotton;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignSelf: "center",
    borderWidth: Size.FindSize(2),
    borderRadius: Size.FindSize(28),
  },
  text: {
    fontSize: Size._18,
    fontFamily: Bold,
    padding: 0,
    color: Colors.white,
    lineHeight: Size._28,
    textAlign: "center",
  },
});
