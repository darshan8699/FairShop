import { Alert } from "react-native";
import RNExitApp from "react-native-exit-app";
import Toast from "react-native-tiny-toast";
import { Regular } from "../Assets/fonts";
import Colors from "./Colors";
import Logger from "./Logger";
import { Size } from "./sizes";
import Strings from "./Strings";
import Toast2 from "react-native-toast-message";

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
  Toast.show(message);
  return;
  Toast.show(message, {
    containerStyle: {
      backgroundColor: Colors.button,
      borderRadius: Size.FindSize(50),
      paddingHorizontal: Size.FindSize(20),
      marginHorizontal: Size.FindSize(20),
      marginBottom: isMoreSpace ? Size.FindSize(100) : 0,
      opacity: 0.5,
    },
    textStyle: {
      fontFamily: Regular,
    },
  });
}

export function showErrorMessage(message) {
  Logger.log({ message });
  Toast.show(message);
  return;
  try {
    Toast.show(message, {
      containerStyle: {
        backgroundColor: Colors.Background,
        borderRadius: Size.FindSize(50),
        paddingHorizontal: Size.FindSize(20),
        marginHorizontal: Size.FindSize(20),
        opacity: 0.5,
      },
      textStyle: {
        fontFamily: Regular,
      },
    });
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

