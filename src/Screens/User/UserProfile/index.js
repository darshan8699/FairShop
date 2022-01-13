//import liraries
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import { Route } from "../../../Navigation/Routes";
import { LOGOUT } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Navigator from "../../../Utility/Navigator";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

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
          onPress: async () => callAPILogout(),
        },
      ],
      { cancelable: false }
    );
  }

  async function callAPILogout() {
    const apiClass = new APICallService(LOGOUT, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          await AsyncStorageLib.setItem("loginInfo", "");
          Navigator.resetFrom(Route.Login);
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
      });
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
      <TouchableOpacity
        onPress={() => Navigator.navigate(Route.AddressListing)}
      >
        <View style={styles.buttonView}>
          <Image
            source={Images.location}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.text}>{Strings.Addresses}</Text>
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
      <TouchableOpacity
        onPress={() =>
          Navigator.navigate(Route.ResetPassword, { isResetPassword: true })
        }
      >
        <View style={styles.buttonView}>
          <Image
            source={Images.myorder}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.text}>{Strings.ChangePassoword}</Text>
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
