//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import AuthHeader from "../../../Components/AuthHeader";
import CustomText from "../../../Components/CustomText";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import Strings from "../../../Utility/Strings";
import APICallService from "../../../API/APICallService";
import { LOGIN, PREF_TOKEN } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showInternetMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { isTextNotEmpty, validateEmail } from "../../../Utility/Validation";

// create a component
const MyComponent = (props) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(email)) {
      showErrorMessage(Strings.error_email);
    }
    // else if (!validateEmail(email)) {
    //   showErrorMessage(Strings.error_valid_email);
    // }
    else if (!isTextNotEmpty(password)) {
      showErrorMessage(Strings.error_password);
    } else {
      APICall();
    }
  };
  const APICall = () => {
    const apiClass = new APICallService(LOGIN, {
      login: email,
      password: password,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          Logger.log("response data", res.data);
          // Navigator.navigate(Route.DrawerApp);
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader />
        <Text style={styles.loginText}>{Strings.Login}</Text>
        <CustomText name={Strings.Email_or_Phone} />
        <CustomInput onChangeText={(text) => setEmail(text)} />
        <CustomText name={Strings.Password} />
        <CustomInput
          RightIcon={showPassword ? "eye-slash" : "eye"}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={() => Navigator.navigate(Route.ForgotPassword)}
        >
          <Text style={styles.forgotText}>{Strings.Forgot_Password}</Text>
        </TouchableOpacity>
        <View style={styles.buttonView}>
          <CustomButton
            text={Strings.LoginWithOTP}
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {}}
          />
          <CustomButton
            text={Strings.Login}
            style={styles.button1}
            textStyle={styles.buttonText1}
            onPress={() => {
              onSubmit();
            }}
          />
        </View>
        <CustomButton
          text={Strings.Sign_Up}
          style={styles.button2}
          textStyle={styles.buttonText2}
          onPress={() => {
            Navigator.navigate(Route.SignUp);
          }}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
