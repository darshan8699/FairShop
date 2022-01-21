import React from "react";
import { Text, View } from "react-native";
import { Regular } from "../Assets/fonts";
import Colors from "../Utility/Colors";
import { Size } from "../Utility/sizes";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const NoDataView = (props) => {
  const {
    isLoader = false,
    isVisible = false,
    title = "",
    textStyle = {},
    containerStyle = {},
    pinCodeList = [],
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
            fontSize: Size.FindSize(14),
            fontFamily: Regular,
            textAlign: "center",
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
      <KeyboardAwareScrollView
        overScrollMode="never"
        bounces={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            display: "flex",
          }}
        >
          {pinCodeList.map((item) => {
            return (
              <View
                style={{
                  paddingHorizontal: Size.FindSize(10),
                  paddingVertical: Size.FindSize(5),
                  backgroundColor: Colors.headerline,
                  borderRadius: Size.FindSize(5),
                  marginStart: Size.FindSize(10),
                  marginTop: Size.FindSize(10),
                  borderColor: Colors.borderColor,
                  borderWidth: Size.FindSize(1),
                }}
              >
                <Text
                  style={[
                    {
                      color: Colors.text,
                      fontSize: Size.FindSize(14),
                      fontFamily: Regular,
                      textAlign: "center",
                    },
                    textStyle,
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </View>
  ) : null;
};

export default NoDataView;
