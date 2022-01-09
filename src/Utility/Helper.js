import { Alert } from "react-native";
import RNExitApp from "react-native-exit-app";
import Toast from "react-native-root-toast";
import Colors from "./Colors";
import Logger from "./Logger";
import Strings from "./Strings";

export function validateResponse(res) {
  Logger.log(res);
  if (res.code === 0) {
    return true;
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
  }, 800);
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
    }, 800);
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
