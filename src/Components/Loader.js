import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef, useState } from "react";
import { Text, Alert, Platform, View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Bold, Regular } from "../Assets/fonts";
import { Route } from "../Navigation/Routes";
import Colors from "../Utility/Colors";
import { PREF_TOKEN } from "../Utility/Constants";
import Logger from "../Utility/Logger";
import Navigator from "../Utility/Navigator";
import { Size } from "../Utility/sizes";
import Strings from "../Utility/Strings";
import CustomNetBotton from "./CustomNetBotton";

export default function Loader(props) {
  const [showLoader, setLoading] = useState(false);
  const [showInternetPopup, setShowInternetPopup] = useState(false);
  const {
    CommonReducer,
    loader,
    unauthorised,
    message,
    locationStatus,
    internetConnected,
  } = useSelector((state) => ({
    CommonReducer: state.CommonReducer,
    loader: state.CommonReducer.isLoading,
    locationStatus: state.CommonReducer.locationStatus,
    internetConnected: state.CommonReducer.internetConnected,
    message: state.CommonReducer.message,
    unauthorised: state.CommonReducer.unauthorised,
  }));

  //Skipping first iteration (exactly like componentWillReceiveProps):
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      //componentDidMount
    } else {
      //componentWillReceiveProps
      setLoading(loader);
      setShowInternetPopup(internetConnected);
      if (unauthorised) {
        setTimeout(
          () => {
            Alert.alert("", message, [
              {
                text: Strings.Ok,
                onPress: () => {
                  AsyncStorage.removeItem(PREF_TOKEN).then((res) =>
                    Navigator.resetFrom(Route.Login)
                  );
                },
              },
            ]);
          },
          Platform.OS == "ios" ? 500 : 0
        );
      }
    }
  }, [CommonReducer]);

  function checkInternetConnection() {
    NetInfo.addEventListener((state) => {
      Logger.log({ isConnected: state.isConnected });
      setShowInternetPopup(state.isConnected);
    });
  }

  return showLoader ? (
    <View
      style={{
        height: Size.height,
        width: Size.width,
        zIndex: 8,
        position: "absolute",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : !internetConnected ? (
    <View
      style={{
        height: Size.height,
        width: Size.width,
        zIndex: 9,
        position: "absolute",
        justifyContent: "center",
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <Text style={{ zIndex: -1, fontFamily: Bold, fontSize: Size._16 }}>
        {Strings.Network_Error}
      </Text>
      <Text style={{ zIndex: -1, fontFamily: Regular, fontSize: Size._14 }}>
        {Strings.No_Internet_Error}
      </Text>
      <CustomNetBotton
        containerStyle={{ zIndex: 11, marginTop: Size.FindSize(10) }}
        title={Strings.Retry}
        onPress={() => {
          checkInternetConnection();
        }}
      />
    </View>
  ) : null;
}
