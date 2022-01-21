//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import APICallService from "../../../API/APICallService";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomText from "../../../Components/CustomText";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { ADD_ADDRESS, ADDRESS_IDWISE } from "../../../Utility/Constants";
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
  const [addressType, setAddressType] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isShowLoader, setLoader] = useState(false);

  const AddressData = [
    { label: "Residential", value: "residential" },
    { label: "Office", value: "office" },
  ];
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      if (props?.route?.params?.updateDetails) {
        GetAddressData();
      } else {
        setLoginInfo();
      }
    }
  });
  function GetAddressData() {
    setLoader(true);
    const apiClass = new APICallService(
      ADDRESS_IDWISE,
      props?.route?.params?.updateDetails
    );
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("address ID wise res", res.data);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  }
  async function setLoginInfo() {
    const jsonValue = await AsyncStorage.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setFullName(
        loginInfo?.item?.profile?.first_name +
          " " +
          loginInfo?.item?.profile?.last_name
      );
      setContact("" + loginInfo?.item?.phone);
    }
  }
  const onSubmit = () => {
    Keyboard.dismiss();
    if (!isTextNotEmpty(addressType)) {
      showErrorMessage(Strings.error_addressType);
    } else if (!isTextNotEmpty(addressLabel)) {
      showErrorMessage(Strings.error_addressLabel);
    } else if (!isTextNotEmpty(fullName)) {
      showErrorMessage(Strings.error_receiver_name);
    } else if (!isTextNotEmpty(contact)) {
      showErrorMessage(Strings.error_contact_no);
    } else if (!isTextNotEmpty(address1)) {
      showErrorMessage(Strings.error_addressline1);
    } else if (!isTextNotEmpty(address2)) {
      showErrorMessage(Strings.error_addressline2);
    } else if (!isTextNotEmpty(city)) {
      showErrorMessage(Strings.error_city);
    } else if (!isTextNotEmpty(state)) {
      showErrorMessage(Strings.error_State);
    } else if (!isTextNotEmpty(pincode)) {
      showErrorMessage(Strings.error_pincode);
    } else {
      AddAddressAPI();
    }
  };
  const AddAddressAPI = () => {
    setLoader(true);
    const apiClass = new APICallService(ADD_ADDRESS, {
      type: addressType,
      name: addressLabel,
      full_name: fullName,
      phone: contact,
      address_line_1: address1,
      address_line_2: address2,
      landmark: landmark,
      pincode: pincode,
      city: city,
      state: state,
      coords: [{ lat: "23546458", long: "236486" }],
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
          props?.route?.params?.onRefresh();
          props.navigation.goBack();
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <ScrollView
        style={{
          padding: Size.FindSize(15),
          marginBottom: Size.FindSize(20),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>{Strings.Add_Address}</Text>
        <CustomText name={Strings.Address_Type} />
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={AddressData}
          maxHeight={120}
          placeholder=""
          labelField="label"
          valueField="value"
          value={addressType}
          onChange={(item) => {
            setAddressType(item.value);
          }}
        />
        <CustomText name={Strings.Address_Label} />
        <CustomInput
          onChangeText={(text) => setAddressLabel(text)}
          value={addressLabel}
        />
        <CustomText name={Strings.Receiver_name} />
        <CustomInput
          onChangeText={(text) => setFullName(text)}
          value={fullName}
        />
        <CustomText name={Strings.Contact_No} />
        <CustomInput
          onChangeText={(text) => setContact(text)}
          value={contact}
          keyboardType="numeric"
        />
        <CustomText name={Strings.Address_Line_1} />
        <CustomInput
          onChangeText={(text) => setAddress1(text)}
          value={address1}
        />
        <CustomText name={Strings.Address_Line_2} />
        <CustomInput
          onChangeText={(text) => setAddress2(text)}
          value={address2}
        />
        <Text style={styles.text}>{Strings.Landmark}</Text>
        <CustomInput
          onChangeText={(text) => setLandmark(text)}
          value={landmark}
        />
        <CustomText name={Strings.City} />
        <CustomInput onChangeText={(text) => setCity(text)} value={city} />
        <CustomText name={Strings.State} />
        <CustomInput onChangeText={(text) => setState(text)} value={state} />
        <CustomText name={Strings.Pincode} />
        <CustomInput
          onChangeText={(text) => setPincode(text)}
          value={pincode}
          keyboardType="numeric"
        />
        <CustomButton
          text={
            props?.route?.params?.updateDetails
              ? Strings.Update
              : Strings.Submit
          }
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => onSubmit()}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
