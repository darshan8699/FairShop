//import liraries
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
import Colors from "../../../Utility/Colors";
import {
  SEND_OTP,
  VERIFY_FORGOT_PASSWORD_OTP,
} from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty } from "../../../Utility/Validation";
import Navigator from "../../../Utility/Navigator";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";

// create a component
const MyComponent = (props) => {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("8217");
  const [isShowLoader, setLoader] = useState(false);
  const [isOTPModelVisble, setOTPModalVisible] = useState(false);

  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(email)) {
      showErrorMessage(Strings.error_email_phone);
    } else {
      APICall();
    }
  };

  const onSubmitOTP = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(email)) {
      showErrorMessage(Strings.error_email_phone);
    } else {
      APICall();
    }
  };

  const APICall = () => {
    setLoader(true);
    const apiClass = new APICallService(SEND_OTP, {
      phone_or_email: email,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setOTP("8217");
          showSuccessMessage("OTP code has been sent to " + email);
          setOTPModalVisible(true);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallVerifyOTP = () => {
    if (otp.length != 4) {
      showErrorMessage(Strings.error_otp);
      return;
    }
    setLoader(true);
    const apiClass = new APICallService(VERIFY_FORGOT_PASSWORD_OTP, {
      phone_or_email: email,
      otp: otp,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setOTPModalVisible(false);
          Logger.log(res?.data?.token);
          Navigator.navigate(Route.ResetPassword, {
            token: res?.data?.token,
            phone_or_email: email,
          });
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
            <CustomText name={Strings.OTP} style={{ marginLeft: 10 }} />
            <OTPInputView
              style={styles.OTPView}
              pinCount={4}
              code={otp}
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
                style={styles.button1}
                textStyle={styles.buttonText1}
                onPress={() => setOTPModalVisible(false)}
              />
              <View style={{ width: Size.FindSize(20) }}></View>
              <CustomButton
                text={Strings.Submit}
                style={[styles.button, { marginTop: Size.FindSize(5) }]}
                textStyle={[styles.buttonText]}
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
        <AuthHeader isBack navigation={props.navigation} />
        <Text style={styles.loginText}>{Strings.Forgot_password}</Text>
        <CustomText name={Strings.Email_or_Phone} />
        <CustomInput
          onChangeText={(text) => setEmail(text)}
          keyboardType={"email-address"}
          autoCapitalize={false}
          onSubmitEditing={() => onSubmit()}
        />
        <CustomButton
          text={Strings.Send}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => onSubmit()}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
