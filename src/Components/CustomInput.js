//import liraries
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Regular } from "../Assets/fonts";
import Colors from "../Utility/Colors";
import { Size } from "../Utility/sizes";

// create a component
const CustomInput = (props) => {
  const [text, setText] = useState("");
  const {
    placeHolder,
    secureTextEntry,
    onChangeText,
    onSubmitEditing,
    keyboardType,
    RightIcon,
    onRightButtonPress,
    enable = true,
    autoCapitalize = true,
    value = "",
    isPhone = false,
  } = props;

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      //componentDidMount
      setText(props.value ? props.value : "");
    } else {
      //componentWillReceiveProps
      if (text != props.value) {
        setText(props.value ? props.value : "");
      }
    }
  }, [props.value]);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeHolder}
        style={[
          styles.input,
          { backgroundColor: enable ? Colors.white : Colors.line },
        ]}
        editable={enable}
        value={text}
        maxLength={isPhone ? 10 : null}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ? keyboardType : "default"}
        returnKeyType={"done"}
        onChangeText={(text) => {
          // var txt = isPhone && text.trim().length == 1 ? "+91 " + text : text;
          // if (text == "+91") {
          //   txt = "";
          // }
          setText(text);
          if (onChangeText) {
            onChangeText(text);
          }
        }}
        onSubmitEditing={() => onSubmitEditing && onSubmitEditing()}
      />
      {RightIcon ? (
        <FontAwesome5
          name={RightIcon}
          size={18}
          style={styles.RightIcon}
          onPress={() => onRightButtonPress()}
        />
      ) : null}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(50),
  },
  input: {
    height: Size.FindSize(50),
    backgroundColor: Colors.white,
    paddingHorizontal: Size.FindSize(15),
    borderColor: Colors.borderColor,
    borderWidth: Size.FindSize(1),
    marginTop: Size.FindSize(8),
    color: Colors.black,
    fontFamily: Regular,
  },
  RightIcon: {
    position: "absolute",
    right: Size.FindSize(15),
    top: Size.FindSize(25),
    color: Colors.button,
  },
});

//make this component available to the app
export default CustomInput;
