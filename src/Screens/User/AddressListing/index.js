//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import Colors from "../../../Utility/Colors";

// create a component
const AddressListing = (props) => {
  const [addressIndex, setaddressIndex] = useState(null);
  const AddressList = [
    {
      Address_type: "Office",
      Address_Label: "G-1Abc",
      ReceiverName: "Test Test",
      Contact: "9898989897",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      Landmark: "Sunlight Colony",
      City: "Noida",
      State: "New Delhi Delhi",
      pincode: "110014",
    },
    {
      Address_type: "Residential",
      Address_Label: "G-1Abc",
      ReceiverName: "Test Test",
      Contact: "9898989897",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      Landmark: "Sunlight Colony",
      City: "Noida",
      State: "New Delhi Delhi",
      pincode: "110014",
    },
    {
      Address_type: "Residential",
      Address_Label: "G-1Abc",
      ReceiverName: "Test Test",
      Contact: "9898989897",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      Landmark: "Sunlight Colony",
      City: "Noida",
      State: "New Delhi Delhi",
      pincode: "110014",
    },
    {
      Address_type: "Office",
      Address_Label: "G-1Abc",
      ReceiverName: "Test Test",
      Contact: "9898989897",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      Landmark: "Sunlight Colony",
      City: "Noida",
      State: "New Delhi Delhi",
      pincode: "110014",
    },
    {
      Address_type: "Office",
      Address_Label: "G-1Abc",
      ReceiverName: "Test Test",
      Contact: "9898989897",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      Landmark: "Sunlight Colony",
      City: "Noida",
      State: "New Delhi Delhi",
      pincode: "110014",
    },
  ];
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
        <Text style={styles.addressameText}>{item.Address_type}</Text>
        <Text style={styles.text1}>Address Label: {item.Address_Label}</Text>
        <Text style={styles.text1}>
          Receiver's Full Name: {item.ReceiverName}
        </Text>
        <Text style={styles.text1}>Contact No.: {item.Contact}</Text>
        <Text style={styles.text1}>Address: {item.Address}</Text>
        <Text style={styles.text1}>Landmark: {item.Landmark}</Text>
        <Text style={styles.text1}>City: {item.City}</Text>
        <Text style={styles.text1}>State: {item.State}</Text>
        <Text style={styles.text1}>Pincode: {item.pincode}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
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
        data={AddressList}
        renderItem={renderAddressList}
        style={styles.addressList}
      />
    </View>
  );
};

//make this component available to the app
export default AddressListing;
