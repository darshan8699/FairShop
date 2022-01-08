//import liraries
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Header from "../../../Components/Header";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "../../../Utility/Logger";

// create a component
const MyComponent = (props) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      setLoginInfo();
    }
  });
  async function setLoginInfo() {
    const jsonValue = await AsyncStorage.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setFirstname(loginInfo?.item?.profile?.first_name);
      setLastname(loginInfo?.item?.profile?.last_name);
      setEmail(loginInfo?.item?.email);
      setPhone("" + loginInfo?.item?.phone);
    }
  }
  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} isRightIcon={false} />
      <ScrollView style={{ padding: Size.FindSize(15), flex: 1 }}>
        <Text style={styles.headerText}>{Strings.My_Profile}</Text>
        <View style={styles.nameView}>
          <View style={styles.halfView}>
            <CustomText name={Strings.First_Name} />
            <CustomInput
              onChangeText={(text) => setFirstname(text)}
              enable={false}
              value={firstname}
            />
          </View>
          <View style={styles.halfView}>
            <CustomText name={Strings.Last_Name} />
            <CustomInput
              onChangeText={(text) => setLastname(text)}
              enable={false}
              value={lastname}
            />
          </View>
        </View>
        <CustomText name={Strings.Email} />
        <CustomInput
          onChangeText={(text) => setEmail(text)}
          enable={false}
          value={email}
        />
        <CustomText name={Strings.Phone} />
        <CustomInput
          enable={false}
          onChangeText={(text) => setPhone(text)}
          keyboardType="numeric"
          value={phone}
        />
        <View style={{ margin: Size.FindSize(20) }}></View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
