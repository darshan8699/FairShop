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
import { Images } from "../../../Assets/images";
import CustomInput from "../../../Components/CustomInput";
import Colors from "../../../Utility/Colors";
// create a component
const MyComponent = (props) => {
  const [pincode, setPincode] = useState("");
  const [storeIndex, setstoreIndex] = useState(null);
  const storeList = [
    {
      ShopName: "Fairshop1",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      City: "Noida 201010",
      State: "New Delhi Delhi 110014",
    },
    {
      ShopName: "Fairshop1",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      City: "Noida 201010",
      State: "New Delhi Delhi 110014",
    },
    {
      ShopName: "Fairshop1",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      City: "Noida 201010",
      State: "New Delhi Delhi 110014",
    },
    {
      ShopName: "Fairshop1",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      City: "Noida 201010",
      State: "New Delhi Delhi 110014",
    },
    {
      ShopName: "Fairshop1",
      Address: "G-1Abc Complex, Near New Sunlight Colony",
      City: "Noida 201010",
      State: "New Delhi Delhi 110014",
    },
  ];
  const renderStoreItem = ({ item, index }) => {
    console.log("index", index);
    return (
      <TouchableOpacity
        style={[
          styles.listView,
          {
            borderColor:
              storeIndex == index ? Colors.Background : Colors.storeBorderColor,
            backgroundColor:
              storeIndex == index ? Colors.pinkBack : Colors.white,
          },
        ]}
        onPress={() => setstoreIndex(index)}
      >
        <Text style={styles.ShopNameText}>{item.ShopName}</Text>
        <Text style={styles.text1}>{item.Address}</Text>
        <Text style={styles.text1}>{item.City}</Text>
        <Text style={styles.text1}>{item.State}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isLocation />
      <ScrollView
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.childContainer}>
          <Text style={styles.headerText}>{Strings.Select_Store}</Text>
          <View style={styles.pincodeView}>
            <Image
              source={Images.pincode}
              resizeMode="contain"
              style={styles.pincodeImage}
            />
            <Text style={styles.text}>{Strings.Enter_pincode}</Text>
          </View>
          <CustomInput input={styles.input} keyboardType={"numeric"} />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={storeList}
            renderItem={renderStoreItem}
            style={styles.storeList}
            nestedScrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
