//import liraries
import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import AuthHeader from "../../../Components/AuthHeader";
import CustomText from "../../../Components/CustomText";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import Strings from "../../../Utility/Strings";

// create a component
const MyComponent = (props) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader />
        <Text style={styles.loginText}>{Strings.Forgot_password}</Text>
        <CustomText name={Strings.Email_or_Phone} />
        <CustomInput onChangeText={(text) => setEmail(text)} />
        <CustomButton
          text={Strings.Send}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => {
            Navigator.navigate(Route.Login);
          }}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
