//import liraries
import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import APICallService from "../../../API/APICallService";
import AuthHeader from "../../../Components/AuthHeader";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Loader2 from "../../../Components/Loader2";
import { Route } from "../../../Navigation/Routes";
import { LOGIN } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty } from "../../../Utility/Validation";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create a component
const Login = (props) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isShowLoader, setLoader] = useState(false);

  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(email)) {
      Logger.log("onSubmit", email);
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
    setLoader(true);
    const apiClass = new APICallService(LOGIN, {
      login: email,
      password: password,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          const jsonValue = JSON.stringify(res.data);
          await AsyncStorage.setItem("loginInfo", jsonValue);
          Navigator.resetFrom(Route.DrawerApp);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Loader2 modalVisible={isShowLoader} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <AuthHeader />
        <Text style={styles.loginText}>{Strings.Login}</Text>
        <CustomText name={Strings.Email_or_Phone} />
        <CustomInput onChangeText={(text) => setEmail(text)} text={email} />
        <CustomText name={Strings.Password} />
        <CustomInput
          RightIcon={showPassword ? "eye-slash" : "eye"}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={(text) => setPassword(text)}
          text={password}
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
export default Login;
