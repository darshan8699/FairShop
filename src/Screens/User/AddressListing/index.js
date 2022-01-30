//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
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
import { MY_ADDRESS, DELETE_ADDRESS } from "../../../Utility/Constants";
import Loader2 from "../../../Components/Loader2";
import APICallService from "../../../API/APICallService";
import Logger from "../../../Utility/Logger";
import { Images } from "../../../Assets/images";

// create a component
const AddressListing = (props) => {
  const [addressIndex, setaddressIndex] = useState(null);
  const [isShowLoader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetAddressData();
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      Logger.log("focus");
      GetAddressData();
    });
    return () => unsubscribe();
  });
  const deleteAddress = (id) => {
    setLoader(true);
    const apiClass = new APICallService(DELETE_ADDRESS, id);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("delete res", res.data);
          GetAddressData();
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
              addressIndex == index ? Colors.Background : Colors.button,
            backgroundColor:
              addressIndex == index ? Colors.pinkBack : Colors.white,
          },
        ]}
        onPress={() => setaddressIndex(index)}
      >
        <View style={styles.nameView}>
          <Text
            style={styles.addressameText}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {item.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() =>
                Navigator.navigate(Route.Address, { updateDetails: item.id })
              }
            >
              <Image
                source={Images.pencil}
                resizeMode={"contain"}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAddress(item.id)}>
              <Image
                source={Images.delete}
                resizeMode={"contain"}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoView}>
          <View style={styles.backView}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <View style={styles.userView}>
            <Image
              source={Images.profile}
              resizeMode={"contain"}
              style={styles.usericon}
            />
            <Text style={styles.text1}>{item.full_name}</Text>
          </View>
          <View style={styles.userView}>
            <Image
              source={Images.call}
              resizeMode={"contain"}
              style={styles.usericon}
            />
            <Text style={styles.text1}>{item.phone}</Text>
          </View>
        </View>
        <Text style={styles.text1}>{item.address_line_1}</Text>
        <Text style={styles.text1}>{item.address_line_2}</Text>
        <Text style={styles.text1}>{item.landmark}</Text>
        <Text style={styles.text1}>
          {item.city + ", " + item.state + "-" + item.pincode}
        </Text>
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
          onPress={() =>
            Navigator.navigate(Route.Address, {
              onRefresh: () => {
                GetAddressData();
              },
            })
          }
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
