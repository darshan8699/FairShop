//import liraries
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
import { launchImageLibrary } from "react-native-image-picker";
import RadioForm from "react-native-simple-radio-button";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import {
  ATTACHMENTS,
  GET_PROFILE,
  POST_RAW,
  PUT,
} from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import { isTextNotEmpty } from "../../../Utility/Validation";
import styles from "./styles";
// create a component
const MyComponent = (props) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageData, setImageData] = useState("");
  const [marritalValue, setMarritalValue] = useState(null);
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [isShowLoader, setLoader] = useState(false);
  const [userId, setUserId] = useState(null);
  const [doa, setdoa] = useState("");
  const [opendoa, setOpendoa] = useState(false);

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
          setFirstname(res.data?.item?.profile?.first_name);
          setLastname(res.data?.item?.profile?.last_name);
          setMarritalValue(res.data?.item?.profile?.marital_status);
          setGenderValue(res.data?.item?.profile?.gender);
          setDate(res.data?.item?.profile?.dob);
          setEmail(res.data?.item?.email);
          setPhone("" + res.data?.item?.phone);
          setUserId(res.data?.item?.id);
          setImageData(res.data?.item?.profile?.profile_pic);
          setdoa(res.data?.item?.profile?.doa);
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
      if (imageURL) {
        APICallUpdateProfilePic();
      } else APICallUpdateProfile();
    }
  };

  const APICallUpdateProfilePic = () => {
    setLoader(true);
    let form = new FormData();
    form.append("attachment[]", imageURL);
    const apiClass = new APICallService(ATTACHMENTS, form);
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          //setLoader(false);
          APICallUpdateProfile(res.data.item[0]);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallUpdateProfile = (profile_pic) => {
    setLoader(true);
    let requestParam;
    if (profile_pic) {
      requestParam = {
        first_name: firstname,
        last_name: lastname,
        dob: date,
        doa: doa,
        gender: genderValue,
        marital_status: marritalValue,
        profile_pic: [profile_pic],
      };
    } else {
      requestParam = {
        first_name: firstname,
        last_name: lastname,
        dob: date,
        doa: doa,
        gender: genderValue,
        marital_status: marritalValue,
      };
    }
    const apiClass = new APICallService(
      "/users/" + userId + " " + PUT,
      requestParam
    );
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setTimeout(() => {
            showSuccessMessage("" + res.message);
          }, 200);
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
        // alert("User cancelled camera picker");
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

      Logger.log(response);
      let source = {
        uri:
          Platform.OS == "ios"
            ? response.assets[0].uri.replace("file://", "")
            : response.assets[0].uri,
        name: String(Date.now()) + "." + response.assets[0].type.split("/")[1],
        type: response.assets[0].type,
      };
      setImageURL(source);
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
          <Image
            source={
              imageURL
                ? { uri: imageURL.uri }
                : imageData
                ? { uri: imageData[0].thumbnail }
                : Images.profile
            }
            style={styles.profileImage}
            // resizeMode={"contain"}
          />
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
        {genderValue != "" && (
          <RadioForm
            radio_props={radio_props}
            initial={genderValue == "female" ? 1 : 0}
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
        )}
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
        <Text style={styles.text}>{Strings.Date_of_Anniversary}</Text>
        <TouchableOpacity
          style={styles.dateView}
          onPress={() => setOpendoa(true)}
        >
          <Text style={styles.dateText}>{doa}</Text>
          {doa == null || doa == "" ? (
            <MaterialIcons
              onPress={() => setOpendoa(true)}
              name="date-range"
              color={Colors.borderColor}
              size={20}
              style={styles.dateIcon}
            />
          ) : (
            <AntDesign
              onPress={() => setdoa("")}
              name="closecircle"
              color={Colors.borderColor}
              size={20}
              style={styles.dateIcon}
            />
          )}
        </TouchableOpacity>
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
        <DatePicker
          modal
          mode="date"
          open={opendoa}
          maximumDate={new Date()}
          date={new Date()}
          onConfirm={(date) => {
            console.log("date", moment(date).format("YYYY-MM_DD"));
            setOpendoa(false);
            setdoa(moment(date).format("YYYY-MM-DD"));
          }}
          onCancel={() => {
            setOpendoa(false);
          }}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
