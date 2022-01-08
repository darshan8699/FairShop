import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useState } from "react";
import { Keyboard, ScrollView, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import AuthHeader from "../../../Components/AuthHeader";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Loader2 from "../../../Components/Loader2";
import { Route } from "../../../Navigation/Routes";
import { PREF_TOKEN, REGISTER } from "../../../Utility/Constants";
import { showErrorMessage } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty, validateEmail } from "../../../Utility/Validation";
import styles from "./styles";

// create a component
const Signup = (props) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isShowLoader, setLoader] = useState(false);

  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(firstname)) {
      showErrorMessage(Strings.error_firstname);
    } else if (!isTextNotEmpty(lastname)) {
      showErrorMessage(Strings.error_lastname);
    } else if (!isTextNotEmpty(email)) {
      showErrorMessage(Strings.error_email);
    } else if (!validateEmail(email)) {
      showErrorMessage(Strings.error_valid_email);
    } else if (!isTextNotEmpty(phone)) {
      showErrorMessage(Strings.error_phone);
    } else if (phone.trim().length != 10) {
      showErrorMessage(Strings.error_valid_phone_number);
    } else if (!isTextNotEmpty(password)) {
      showErrorMessage(Strings.error_password);
    } else if (password.trim().length < 8) {
      showErrorMessage(Strings.error_valid_password);
    } else {
      APICall();
    }
  };

  const APICall = () => {
    setLoader(true);
    const apiClass = new APICallService(REGISTER, {
      email: email,
      password: password,
      phone: phone,
      first_name: firstname,
      last_name: lastname,
      home_store_id: "1",
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (res.item) {
          const jsonValue = JSON.stringify(res);
          await AsyncStorageLib.setItem(PREF_TOKEN, res.data?.token);
          await AsyncStorageLib.setItem("loginInfo", jsonValue);
          Navigator.resetFrom(Route.DrawerApp);
        } else {
          showErrorMessage(res.message);
        }
        // if (validateResponse(res)) {
        //   Logger.log("response data", res);
        //   Navigator.navigate(Route.DrawerApp);
        // } else {
        //   Logger.log("Erro", res.message);
        // }
      })
      .catch((err) => {
        setLoader(false);
        Logger.log("APICall==>", err);
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
        <Text style={styles.loginText}>{Strings.Sign_Up}</Text>
        <View style={styles.nameView}>
          <View style={styles.halfView}>
            <CustomText name={Strings.First_Name} />
            <CustomInput onChangeText={(text) => setFirstname(text)} />
          </View>
          <View style={styles.halfView}>
            <CustomText name={Strings.Last_Name} />
            <CustomInput onChangeText={(text) => setLastname(text)} />
          </View>
        </View>
        <CustomText name={Strings.Email} />
        <CustomInput
          onChangeText={(text) => setEmail(text)}
          keyboardType={"email-address"}
          autoCapitalize={false}
        />
        <CustomText name={Strings.Phone} />
        <CustomInput
          onChangeText={(text) => setPhone(text)}
          keyboardType="numeric"
        />
        <CustomText name={Strings.Password} />
        <CustomInput
          RightIcon={showPassword ? "eye-slash" : "eye"}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={(text) => setPassword(text)}
        />
        <CustomButton
          text={Strings.Sign_Up}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => {
            onSubmit();
          }}
        />
        <CustomButton
          text={Strings.Login}
          style={styles.button1}
          textStyle={styles.buttonText1}
          onPress={() => {
            Navigator.navigate(Route.Login);
          }}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default Signup;
