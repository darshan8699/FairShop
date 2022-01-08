//import liraries
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import { Images } from "../../../Assets/images";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

// create a component
const MyComponent = (props) => {
  async function onLogoutPress() {
    Alert.alert(
      Strings.Logout,
      Strings.Logout_Msg,
      [
        {
          text: Strings.No,
        },
        {
          text: Strings.Yes,
          onPress: async () => {
            await AsyncStorageLib.setItem("loginInfo", "");
            Navigator.resetFrom(Route.Login);
          },
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      <Text style={styles.headerText}>{Strings.My_Profile}</Text>
      <TouchableOpacity onPress={() => Navigator.navigate(Route.MyProfile)}>
        <View style={styles.buttonView}>
          <Image
            source={Images.profile}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.text}>{Strings.My_Profile}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity onPress={() => Navigator.navigate(Route.MyOrders)}>
        <View style={styles.buttonView}>
          <Image
            source={Images.myorder}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.text}>{Strings.My_Order}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity onPress={() => onLogoutPress()}>
        <View style={styles.buttonView}>
          <Image
            source={Images.logout}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.text}>{Strings.Logout}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
