import moment from "moment";
import { Alert } from "react-native";
import RNExitApp from "react-native-exit-app";
import Toast from "react-native-root-toast";
import Colors from "./Colors";
import Logger from "./Logger";
import Strings from "./Strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALL_CART, ALL_WISHLIST } from "../Utility/Constants";

export function validateResponse(res) {
  Logger.log(res);
  if (res.code === 0) {
    return true;
  } else if (res.code == 260) {
  } else if (res.code == 250) {
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

export async function checkFavItem(itemCode) {
  await AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
    if (JSON.parse(result).indexOf(itemCode) !== -1) {
      return true;
    } else {
      return false;
    }
  });
}

export function getFormateTimeString(date1, date2) {
  // var t1 = new Date("2021-08-26T09:15:04.000Z");
  // var t2 = new Date();
  // var dif = t1.getTime() - t2.getTime();
  var now = moment(new Date(date1)); //todays date
  var end = moment(new Date(date2)); // another date
  var duration = moment.duration(now.diff(end));
  var seconds = duration.asSeconds();
  var minutes = duration.asMinutes();
  var hours = duration.asHours();
  var days = duration.asDays();
  var weeks = duration.asWeeks();
  var months = duration.asMonths();
  var years = duration.asYears();
  var formattedString = "";

  if (seconds <= 59) formattedString = Math.round(seconds) + " seconds ";
  else if (minutes <= 59)
    formattedString =
      Math.round(minutes) +
      (Math.round(minutes) > 1 ? " minutes " : " minute ");
  else if (hours <= 24)
    formattedString =
      Math.round(hours) + (Math.round(hours) > 1 ? " hours " : " hour ");
  else if (days <= 31)
    formattedString =
      Math.round(days) + (Math.round(days) > 1 ? " days " : " day ");
  else if (weeks <= 1)
    formattedString =
      Math.round(weeks) + (Math.round(weeks) > 1 ? " weeks " : " week ");
  else if (months <= 12)
    formattedString =
      Math.round(months) + (Math.round(months) > 1 ? " months " : " month ");
  else if (years <= 1)
    formattedString =
      Math.round(years) + (Math.round(years) > 1 ? " years " : " year ");
  return formattedString;
}
