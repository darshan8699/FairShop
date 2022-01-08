import { Alert } from "react-native";
import RNExitApp from "react-native-exit-app";
import Toast from "react-native-toast-message";
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
  Toast.show({
    type: "success",
    text1: "Hello",
    text2: "This is some something 👋",
  });
  // Toast.show(message, {
  //   position: "TOP",
  //   containerStyle: {
  //     backgroundColor: Colors.button,
  //     borderRadius: Size.FindSize(50),
  //     paddingHorizontal: Size.FindSize(20),
  //     marginHorizontal: Size.FindSize(20),
  //     marginBottom: isMoreSpace ? Size.FindSize(100) : 0,
  //     opacity: 0.5,
  //   },
  //   textStyle: {
  //     fontFamily: Regular,
  //   },
  // });
}

export function showErrorMessage(message) {
  Logger.log({ message });

  try {
    Toast.show({
      type: "success",
      text1: "Hello",
      text2: "This is some something 👋",
    });
    // Toast.show(message, {
    //   position: "top",
    //   containerStyle: {
    //     backgroundColor: Colors.Background,
    //     borderRadius: Size.FindSize(50),
    //     paddingHorizontal: Size.FindSize(20),
    //     marginHorizontal: Size.FindSize(20),
    //     opacity: 0.5,
    //   },
    //   textStyle: {
    //     fontFamily: Regular,
    //   },
    // });
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
