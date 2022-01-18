import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as constants from "../Utility/Constants";
import { showErrorMessage } from "../Utility/Helper";
import Logger from "../Utility/Logger";
import Strings from "../Utility/Strings";

class APICallService {
  constructor(apiname, params) {
    this.url = constants.BASE_URL;
    var arr = apiname.toString().split(" ");
    this.apiType = arr[1];
    this.apiName = arr[0];
    this.params = params;
  }

  async findSettings(apiName, apiType, params) {
    const resourceURL = `${this.url}${apiName}`;
    var myHeaders = new Headers();
    try {
      let token = await AsyncStorage.getItem(constants.PREF_TOKEN);
      if (token) myHeaders.append("Authorization", "Bearer " + token);
      Logger.log("token", token);
    } catch (error) {
      Logger.log(error, "PREF_TOKEN error");
    }
    Logger.log("apiType=> ", apiType);
    if (apiName == constants.ADD_POST) {
      myHeaders.append("Content-Type", "multipart/form-data");
    } else {
      myHeaders.append("Content-Type", "application/json");
    }
    myHeaders.append("Accept", "application/json");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");

    var settings = {
      redirect: "follow",
      url: resourceURL,
      headers: myHeaders,
    };
    switch (apiType) {
      case constants.GET:
        settings.method = "GET";
        break;
      case constants.GET_ID_PARAMS:
        settings.method = "GET";
        settings.url = resourceURL + "/" + params;
        break;
      case constants.GET_URL_PARAMS:
        settings.method = "GET";
        settings.url = resourceURL + "?" + this.objToQueryString(params);
        break;
      case constants.POST_RAW:
        myHeaders.append("Content-Type", "application/json");
        settings.headers = myHeaders;
        settings.method = "POST";
        settings.body = JSON.stringify(params);
        break;
      case constants.POST:
        settings.headers = myHeaders;
        settings.method = "POST";
        settings.body = null;
        break;
      case constants.POST_FORM:
        //settings.headers = myHeaders;
        settings.method = "POST";
        settings.body = JSON.stringify(params);
        break;
      case constants.PUT:
        //settings.headers = myHeaders;
        settings.method = "PUT";
        // settings.body = JSON.stringify(params);
        settings.body = params;
        break;
      case constants.MULTI_PART:
        // settings.headers = myHeaders;
        settings.method = "POST";
        settings.body = params;
        break;
      case constants.DELETE_ID_PARAMS:
        settings.method = "DELETE";
        settings.url = resourceURL + "/" + params;
        break;
      default:
        settings.method = "GET";
        break;
    }
    return settings;
  }

  objToQueryString = (obj) => {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(key + "=" + obj[key]);
    }
    return keyValuePairs.join("&");
  };
  objToURLEncodedString = (obj) => {
    var formBody = [];
    for (var property in obj) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(obj[property]);
      if (obj[property].constructor === Array) {
        obj[property].forEach((obj) => {
          formBody.push(encodedKey + "=" + encodeURIComponent(obj));
        });
      } else {
        formBody.push(encodedKey + "=" + encodedValue);
      }
    }
    formBody = formBody.join("&");
    return formBody;
  };

  objToFormData = (obj) => {
    var form = new FormData();
    for (const key in obj) {
      form.append(key, obj[key]);
    }
    return form;
  };

  objectToURLEncode = (obj) => {
    var urlencoded = new URLSearchParams();
    for (const key in obj) {
      urlencoded.append(key, obj[key]);
    }
    return urlencoded;
  };

  async callAPI() {
    // Api call url
    const mObj = await NetInfo.fetch();
    if (!mObj.isConnected) {
      showErrorMessage(Strings.Internet_Error);
      return { code: 899, message: Strings.Internet_Error };
    } else {
      this.settings = await this.findSettings(
        this.apiName,
        this.apiType,
        this.params
      );
      Logger.log("URL=> " + JSON.stringify(this.settings.url));
      Logger.log("Params=> " + JSON.stringify(this.settings.body));

      return fetch(this.settings.url, this.settings)
        .then(async (res) => {
          const resSize = res._bodyInit._data.size;
          if (resSize > 0) {
            const resTemp = await res.json();
            Logger.log("URL=> " + JSON.stringify(this.settings.url));
            Logger.log("Params=> " + JSON.stringify(this.settings.body));
            Logger.log("Response => ", JSON.stringify(resTemp));
            Logger.log("Setting => ", JSON.stringify(this.settings));
            return resTemp;
          } else {
            const successRes = {
              code: res.status,
              message: res ? res.message : "",
            };
            return successRes;
          }
        })
        .catch((err) => {
          Logger.log("URL=> " + JSON.stringify(this.settings.url));
          Logger.log("Response Error=> ", err);
          const successRes = { code: 899, message: err };
          return successRes;
        });
    }
  }
}

export default APICallService;
