import moment from "moment";
import { Alert } from "react-native";
import RNExitApp from "react-native-exit-app";
import Toast from "react-native-root-toast";
import Colors from "./Colors";
import Logger from "./Logger";
import Strings from "./Strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALL_WISHLIST } from "../Utility/Constants";

export function validateResponse(res) {
  Logger.log(res);
  if (res.code === 0) {
    return true;
  } else if (res.code == 260) {
  } else if (res.code == 401) {
    if (res.message == "Unauthorized") {
      showErrorMessage(Strings.Token_expired);
      callLogoutRedirectToLogin();
    } else {
      showErrorMessage("" + res.message);
    }
  } else {
    if (res.message) {
      showErrorMessage("" + res.message);
    } else if (res.message) {
      showErrorMessage("" + res.message);
    }
  }
}

export function showSuccessMessage(message, isMoreSpace) {
  Logger.log({ message });
  try {
    let toast = Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: Colors.green,
      textColor: Colors.white,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });

    // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    setTimeout(function () {
      Toast.hide(toast);
    }, 1500);
  } catch (e) {
    Logger.log(e);
  }
}

export function showErrorMessage(message) {
  Logger.log({ message });

  try {
    let toast = Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: Colors.red,
      textColor: Colors.white,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });

    // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    setTimeout(function () {
      Toast.hide(toast);
    }, 1500);
  } catch (e) {
    Logger.log(e);
  }
}

export function showInternetMessage() {
  Alert.alert(
    null,
    Strings.Internet_Error,
    [
      {
        text: Strings.Ok,
        onPress: () => {
          RNExitApp.exitApp();
        },
      },
    ],
    { cancelable: false }
  );
}

export function getFormatedate(dateTime, format = "ddd, DD.MM.yyyy, hh.mm a") {
  moment.locale("en");
  var dt = dateTime;

  if (dateTime != null) {
    return moment(dt).format(format);
  } else {
    return moment(new Date()).format(format);
  }
}

export function checkFavItem(itemCode) {
  AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
    console.log("result is :", JSON.parse(result));
    console.log("item code is :", itemCode);
    if (JSON.parse(result).indexOf(itemCode) !== -1) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      return false;
    }
  });
}
