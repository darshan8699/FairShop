//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Header from "../../../Components/Header";
import { Route } from "../../../Navigation/Routes";
import Colors from "../../../Utility/Colors";
import Navigator from "../../../Utility/Navigator";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import { MY_ADDRESS } from "../../../Utility/Constants";
import Loader2 from "../../../Components/Loader2";
import APICallService from "../../../API/APICallService";
import Logger from "../../../Utility/Logger";

// create a component
const AddressListing = (props) => {
  const [addressIndex, setaddressIndex] = useState(null);
  const [isShowLoader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  // const AddressList = [
  //   {
  //     Address_type: "Office",
  //     Address_Label: "G-1Abc",
  //     ReceiverName: "Test Test",
  //     Contact: "9898989897",
  //     Address: "G-1Abc Complex, Near New Sunlight Colony",
  //     Landmark: "Sunlight Colony",
  //     City: "Noida",
  //     State: "New Delhi Delhi",
  //     pincode: "110014",
  //   },
  //   {
  //     Address_type: "Residential",
  //     Address_Label: "G-1Abc",
  //     ReceiverName: "Test Test",
  //     Contact: "9898989897",
  //     Address: "G-1Abc Complex, Near New Sunlight Colony",
  //     Landmark: "Sunlight Colony",
  //     City: "Noida",
  //     State: "New Delhi Delhi",
  //     pincode: "110014",
  //   },
  //   {
  //     Address_type: "Residential",
  //     Address_Label: "G-1Abc",
  //     ReceiverName: "Test Test",
  //     Contact: "9898989897",
  //     Address: "G-1Abc Complex, Near New Sunlight Colony",
  //     Landmark: "Sunlight Colony",
  //     City: "Noida",
  //     State: "New Delhi Delhi",
  //     pincode: "110014",
  //   },
  //   {
  //     Address_type: "Office",
  //     Address_Label: "G-1Abc",
  //     ReceiverName: "Test Test",
  //     Contact: "9898989897",
  //     Address: "G-1Abc Complex, Near New Sunlight Colony",
  //     Landmark: "Sunlight Colony",
  //     City: "Noida",
  //     State: "New Delhi Delhi",
  //     pincode: "110014",
  //   },
  //   {
  //     Address_type: "Office",
  //     Address_Label: "G-1Abc",
  //     ReceiverName: "Test Test",
  //     Contact: "9898989897",
  //     Address: "G-1Abc Complex, Near New Sunlight Colony",
  //     Landmark: "Sunlight Colony",
  //     City: "Noida",
  //     State: "New Delhi Delhi",
  //     pincode: "110014",
  //   },
  // ];
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetAddressData();
    }
  });
  const GetAddressData = () => {
    setLoader(true);
    const apiClass = new APICallService(MY_ADDRESS, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("data is:", res.data.items);
          setData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const renderAddressList = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.listView,
          {
            borderColor:
              addressIndex == index
                ? Colors.Background
                : Colors.storeBorderColor,
            backgroundColor:
              addressIndex == index ? Colors.pinkBack : Colors.white,
          },
        ]}
        onPress={() => setaddressIndex(index)}
      >
        <Text style={styles.addressameText}>{item.type}</Text>
        <Text style={styles.text1}>Address Label: {item.name}</Text>
        <Text style={styles.text1}>Receiver's Full Name: {item.full_name}</Text>
        <Text style={styles.text1}>Contact No.: {item.phone}</Text>
        <Text style={styles.text1}>Address Line 1: {item.address_line_1}</Text>
        <Text style={styles.text1}>Address Line 2: {item.address_line_2}</Text>
        <Text style={styles.text1}>Landmark: {item.landmark}</Text>
        <Text style={styles.text1}>City: {item.city}</Text>
        <Text style={styles.text1}>State: {item.state}</Text>
        <Text style={styles.text1}>Pincode: {item.pincode}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <View style={styles.headerView}>
        <Text style={styles.headerText}>{Strings.Addresses}</Text>
        <TouchableOpacity
          style={styles.addbuttonView}
          onPress={() => Navigator.navigate(Route.Address)}
        >
          <Text style={styles.addbuttontext}>{"+ " + Strings.Add}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderAddressList}
        style={styles.addressList}
      />
    </View>
  );
};

//make this component available to the app
export default AddressListing;
