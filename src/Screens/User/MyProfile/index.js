//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import CustomButton from "../../../Components/CustomButton";
import Header from "../../../Components/Header";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RadioForm from "react-native-simple-radio-button";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-date-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../../../Utility/Colors";
import moment from "moment";
import { isTextNotEmpty } from "../../../Utility/Validation";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import { PREF_TOKEN, PROFILE, GET_PROFILE } from "../../../Utility/Constants";
import Loader2 from "../../../Components/Loader2";
import APICallService from "../../../API/APICallService";
// create a component
const MyComponent = (props) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [marritalValue, setMarritalValue] = useState(null);
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [isShowLoader, setLoader] = useState(false);
  const [userId, setUserId] = useState(null);
  var radio_props = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const MaritalData = [
    { label: "Married", value: "married" },
    { label: "Unmarried", value: "unmarried" },
  ];
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      // setLoginInfo();
      GetProfileData();
    }
  });

  const GetProfileData = () => {
    setLoader(true);
    const apiClass = new APICallService(GET_PROFILE, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("GET profile data is ", res.data);
          setFirstname(res.data?.item?.profile?.first_name);
          setLastname(res.data?.item?.profile?.last_name);
          setMarritalValue(res.data?.item?.profile?.marital_status);
          setGenderValue(res.data?.item?.profile?.gender);
          setDate(res.data?.item?.profile?.dob);
          setEmail(res.data?.item?.email);
          setPhone("" + res.data?.item?.phone);
          setUserId(res.data?.item?.id);
          Logger.log(
            "res.data?.item?.profile?.gender",
            res.data?.item?.profile?.gender
          );
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(firstname)) {
      showErrorMessage(Strings.error_firstname);
    } else if (!isTextNotEmpty(lastname)) {
      showErrorMessage(Strings.error_lastname);
    } else if (!isTextNotEmpty(date)) {
      showErrorMessage(Strings.error_DOB);
    } else if (!isTextNotEmpty(genderValue)) {
      showErrorMessage(Strings.error_gender);
    } else {
      APICallUpdateProfile();
    }
  };

  const APICallUpdateProfile = () => {
    Logger.log("value", genderValue);
    setLoader(true);
    const apiClass = new APICallService("/users/" + userId, {
      first_name: firstname,
      last_name: lastname,
      dob: date,
      gender: genderValue,
      marital_status: marritalValue,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("data is ", res.data);
          showSuccessMessage(res.message);
          const jsonValue = JSON.stringify(res.data);
          // await AsyncStorage.setItem(PREF_TOKEN, res.data?.token);
          // await AsyncStorage.setItem("loginInfo", jsonValue);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const chooseFile = () => {
    let options = {
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      setImageURL(response.assets[0].uri);
    });
  };
  // async function setLoginInfo() {
  //   const jsonValue = await AsyncStorage.getItem("loginInfo");
  //   const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
  //   Logger.log({ loginInfo });

  //   if (loginInfo) {
  //     setFirstname(loginInfo?.item?.profile?.first_name);
  //     setLastname(loginInfo?.item?.profile?.last_name);
  //     setEmail(loginInfo?.item?.email);
  //     setPhone("" + loginInfo?.item?.phone);
  //     setUserId(loginInfo?.item?.id);
  //   }
  // }

  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <ScrollView
        style={{
          padding: Size.FindSize(15),
          marginBottom: Size.FindSize(20),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>{Strings.My_Profile}</Text>
        <Text style={styles.text}>{Strings.Profile_Picture}</Text>
        <View style={styles.profileView}>
          <Image source={imageURL} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => chooseFile()}
          >
            <AntDesign
              name="upload"
              size={15}
              style={styles.uploadIcon}
              color={Colors.uploadText}
            />
            <Text style={styles.uploadText}>{Strings.Upload}</Text>
          </TouchableOpacity>
        </View>
        <CustomText name={Strings.Email} />
        <CustomInput
          onChangeText={(text) => setEmail(text)}
          enable={false}
          value={email}
        />
        <CustomText name={Strings.Contact_No} />
        <CustomInput
          enable={false}
          onChangeText={(text) => setPhone(text)}
          keyboardType="numeric"
          value={phone}
        />
        <View style={styles.nameView}>
          <View style={styles.halfView}>
            <CustomText name={Strings.First_Name} />
            <CustomInput
              onChangeText={(text) => setFirstname(text)}
              value={firstname}
            />
          </View>
          <View style={styles.halfView}>
            <CustomText name={Strings.Last_Name} />
            <CustomInput
              onChangeText={(text) => setLastname(text)}
              value={lastname}
            />
          </View>
        </View>
        <CustomText name={Strings.Date_of_Birth} />
        <TouchableOpacity style={styles.dateView} onPress={() => setOpen(true)}>
          <Text style={styles.dateText}>{date}</Text>
          {date == null || date == "" ? (
            <MaterialIcons
              onPress={() => setOpen(true)}
              name="date-range"
              color={Colors.borderColor}
              size={20}
              style={styles.dateIcon}
            />
          ) : (
            <AntDesign
              onPress={() => setDate("")}
              name="closecircle"
              color={Colors.borderColor}
              size={20}
              style={styles.dateIcon}
            />
          )}
        </TouchableOpacity>
        <CustomText name={Strings.Gender} />
        <RadioForm
          radio_props={radio_props}
          initial={genderValue == "male" ? 0 : genderValue == "female" ? 1 : -1}
          formHorizontal={true}
          labelHorizontal={true}
          buttonColor={Colors.borderColor}
          selectedButtonColor={Colors.Background}
          buttonSize={Size.FindSize(10)}
          buttonOuterSize={Size.FindSize(20)}
          style={{
            marginTop: Size.FindSize(10),
          }}
          labelStyle={styles.radioText}
          onPress={(value) => {
            setGenderValue(value);
          }}
        />
        <Text style={styles.text}>{Strings.Marital_Status}</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          placeholder=""
          data={MaritalData}
          maxHeight={120}
          labelField="label"
          valueField="value"
          value={marritalValue}
          onChange={(item) => {
            setMarritalValue(item.value);
          }}
        />
        <CustomButton
          text={Strings.Submit}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => onSubmit()}
        />
        <DatePicker
          modal
          mode="date"
          open={open}
          maximumDate={new Date()}
          date={new Date()}
          onConfirm={(date) => {
            console.log("date", moment(date).format("YYYY-MM_DD"));
            setOpen(false);
            setDate(moment(date).format("YYYY-MM-DD"));
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
