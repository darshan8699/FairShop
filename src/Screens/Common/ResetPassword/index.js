//import liraries
import React, { useState } from "react";
import { Keyboard, ScrollView, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import AuthHeader from "../../../Components/AuthHeader";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Loader2 from "../../../Components/Loader2";
import { RESET_PASSWORD, CHANGE_PASSWORD } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty } from "../../../Utility/Validation";
import styles from "./styles";
import Navigator from "../../../Utility/Navigator";
import { Route } from "../../../Navigation/Routes";

// create a component
const ResetPassword = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowLoader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [isResetPassoword] = useState(props?.route?.params?.isResetPassword);

  const onSubmit = () => {
    Keyboard.dismiss();

    if (isResetPassoword && !isTextNotEmpty(oldPassword)) {
      showErrorMessage(Strings.error_old_password);
    } else if (!isTextNotEmpty(password)) {
      showErrorMessage(Strings.error_new_password);
    } else if (password.trim().length < 8) {
      showErrorMessage(Strings.error_valid_password);
    } else if (!isTextNotEmpty(confirmPassword)) {
      showErrorMessage(Strings.error_confirm_password);
    } else if (password != confirmPassword) {
      showErrorMessage(Strings.error_password_match);
    } else {
      isResetPassoword ? APICallChangePassword() : APICall();
    }
  };

  const APICall = () => {
    setLoader(true);
    const apiClass = new APICallService(RESET_PASSWORD, {
      phone_or_email: props.route?.params?.phone_or_email,
      password: password,
      password_confirmation: confirmPassword,
      token: props.route?.params?.token,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          Navigator.resetFrom(Route.Login);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallChangePassword = () => {
    setLoader(true);
    const apiClass = new APICallService(CHANGE_PASSWORD, {
      old_password: oldPassword,
      password: password,
      password_confirmation: confirmPassword,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          props.navigation.goBack();
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
        <AuthHeader isBack navigation={props.navigation} />
        <Text style={styles.loginText}>
          {isResetPassoword ? Strings.ChangePassoword : Strings.ResetPassword}
        </Text>
        {isResetPassoword && (
          <View>
            <CustomText name={Strings.OldPassword} />
            <CustomInput
              RightIcon={showOldPassword ? "eye-slash" : "eye"}
              secureTextEntry={showOldPassword}
              onRightButtonPress={() => setShowOldPassword(!showOldPassword)}
              onChangeText={(text) => setOldPassword(text)}
            />
          </View>
        )}
        <CustomText name={Strings.NewPassword} />
        <CustomInput
          RightIcon={showPassword ? "eye-slash" : "eye"}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={(text) => setPassword(text)}
        />
        <CustomText name={Strings.ConfrimPassword} />
        <CustomInput
          // RightIcon={showPassword ? "eye-slash" : "eye"}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <CustomButton
          text={Strings.Submit}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => onSubmit()}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default ResetPassword;
