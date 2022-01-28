//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
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
import Colors from "../../../Utility/Colors";
import { LOGIN, PREF_TOKEN, SEND_OTP } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty } from "../../../Utility/Validation";
import styles from "./styles";

// create a component
const Login = (props) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [isShowLoader, setLoader] = useState(false);
  const [isOTPModelVisble, setOTPModalVisible] = useState(false);

  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(email)) {
      Logger.log("onSubmit", email);
      showErrorMessage(Strings.error_email_phone);
    } else if (!isTextNotEmpty(password)) {
      showErrorMessage(Strings.error_password);
    } else {
      APICall();
    }
  };
  const onSubmitOTP = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(email)) {
      showErrorMessage(Strings.error_email_phone);
    } else {
      APICallSentOTP();
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
          await AsyncStorage.setItem(PREF_TOKEN, res.data?.token);
          await AsyncStorage.setItem("loginInfo", jsonValue);
          Navigator.resetFrom(Route.DrawerApp);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallSentOTP = () => {
    setLoader(true);
    const apiClass = new APICallService(SEND_OTP, {
      phone_or_email: email,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage("OTP code has been sent to " + email);
          setOTPModalVisible(true);
          // const jsonValue = JSON.stringify(res.data);
          // await AsyncStorage.setItem("loginInfo", jsonValue);
          // Navigator.resetFrom(Route.DrawerApp);
        }
      })
      .catch((err) => {
        setLoader(false);
        setOTPModalVisible(false);
        showErrorMessage(err.message);
      });
  };

  const APICallVerifyOTP = () => {
    if (otp.length != 4) {
      showErrorMessage(Strings.error_otp);
      return;
    }
    setLoader(true);
    const apiClass = new APICallService(LOGIN, {
      login: email,
      password: otp,
      login_with_otp: "Y",
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setOTPModalVisible(false);
          showSuccessMessage(res.message);
          const jsonValue = JSON.stringify(res.data);
          await AsyncStorage.setItem(PREF_TOKEN, res.data?.token);
          await AsyncStorage.setItem("loginInfo", jsonValue);
          Navigator.resetFrom(Route.DrawerApp);
        }
      })
      .catch((err) => {
        setLoader(false);
        setOTPModalVisible(true);
        showErrorMessage(err.message);
      });
  };

  const renderOTPView = () => {
    return (
      <Modal animationType="none" transparent={true} visible={isOTPModelVisble}>
        <View
          style={{
            height: Size.height,
            width: Size.width,
            zIndex: 8,
            position: "absolute",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            paddingHorizontal: Size.FindSize(20),
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              padding: Size.FindSize(20),
              borderRadius: Size.FindSize(20),
            }}
          >
            <CustomText name={Strings.OTP} customStyle={{ marginLeft: 10 }} />
            <OTPInputView
              style={styles.OTPView}
              pinCount={4}
              code={otp}
              editable
              clearInputs={otp.length == 0 ? true : false}
              onCodeChanged={(otp) => setOTP(otp)}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
            <TouchableOpacity onPress={() => onSubmitOTP()}>
              <Text style={[styles.forgotText, { marginEnd: 10 }]}>
                {Strings.ResendOTP}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonView}>
              <CustomButton
                text={Strings.Cancel}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => setOTPModalVisible(false)}
              />
              <View style={{ width: Size.FindSize(20) }}></View>
              <CustomButton
                text={Strings.Submit}
                style={styles.button1}
                textStyle={styles.buttonText1}
                onPress={() => APICallVerifyOTP()}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Loader2 modalVisible={isShowLoader} />
      {renderOTPView()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <AuthHeader />
        <Text style={styles.loginText}>{Strings.Login}</Text>
        <CustomText name={Strings.Email_or_Phone} />
        <CustomInput
          onChangeText={(text) => setEmail(text)}
          keyboardType={"email-address"}
          autoCapitalize={false}
        />
        <CustomText name={Strings.Password} />
        <CustomInput
          RightIcon={showPassword ? "eye-slash" : "eye"}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={() => onSubmit()}
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
            onPress={() => onSubmitOTP()}
          />
          <View style={{ width: Size.FindSize(20) }}></View>
          <CustomButton
            text={Strings.Login}
            style={styles.button1}
            textStyle={styles.buttonText1}
            onPress={() => onSubmit()}
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
