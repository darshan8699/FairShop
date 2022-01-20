import React from "react";
import { Text, View } from "react-native";
import { Regular } from "../Assets/fonts";
import Colors from "../Utility/Colors";
import { Size } from "../Utility/sizes";

const NoDataView = (props) => {
  const {
    isLoader = false,
    isVisible = false,
    title = "",
    textStyle = {},
    containerStyle = {},
  } = props;

  return !isLoader && isVisible ? (
    <View
      style={[
        containerStyle,
        {
          alignItems: "center",
          padding: Size.FindSize(20),
          alignSelf: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Text
        style={[
          {
            color: Colors.text,
            fontSize: Size.FindSize(18),
            fontFamily: Regular,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </View>
  ) : null;
};

export default NoDataView;
