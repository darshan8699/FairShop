//import liraries
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { Route } from "../../../Navigation/Routes";
import { LOGOUT, PREF_STORE_ID } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [loginInfo, setLoginInfo] = useState("");
  const isFirstRun = useRef(true);
  const [isShowLoader, setLoader] = useState(false);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      initialCalls();
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      Logger.log("focus");
      initialCalls();
    });
    return () => unsubscribe();
  });

  const initialCalls = async () => {
    const jsonValue = await AsyncStorageLib.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    setLoginInfo(loginInfo);
  };

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
    setLoader(true);
    const apiClass = new APICallService(LOGOUT, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
          await AsyncStorageLib.clear();
          await AsyncStorageLib.setItem(PREF_STORE_ID, id);
          setLoader(false);
          Navigator.navigate(Route.Login);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  }

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      <Loader2 modalVisible={isShowLoader} />
      {loginInfo ? (
        <View>
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
          <TouchableOpacity onPress={() => Navigator.navigate(Route.Wishlist)}>
            <View style={styles.buttonView}>
              <Image
                source={Images.fav}
                resizeMode="contain"
                style={styles.icon}
              />
              <Text style={styles.text}>{Strings.Wishlist}</Text>
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
          <TouchableOpacity
            onPress={() => Navigator.navigate(Route.LoyaltyRewards)}
          >
            <View style={styles.buttonView}>
              <Image
                source={Images.badge}
                resizeMode="contain"
                style={styles.icon}
              />
              <Text style={styles.text}>{Strings.Loyalty_Rewards}</Text>
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
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.loginText2}>
            {
              "From delicious meals to the freshest fruits & vegetables, quality living starts here!"
            }
          </Text>
          <TouchableOpacity
            style={styles.loginView}
            onPress={() => Navigator.navigate(Route.Login)}
          >
            <Text style={styles.loginText}>{Strings.Login}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

//make this component available to the app
export default MyComponent;
