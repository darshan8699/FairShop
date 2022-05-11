import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import CustomInput from "../../../Components/CustomInput";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import Colors from "../../../Utility/Colors";
import { PREF_STORE_ID, STORE_LOCATOR } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
// create a component
const MyComponent = (props) => {
  const [pincode, setPincode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [storeIndex, setStoreIndex] = useState(null);
  const [isShowLoader, setLoader] = useState(false);
  const [storeListing, setStoreListing] = useState([]);
  const [searchStoreListing, setSearchStoreListing] = useState([]);
  const [pinCodeList, setPinCodeList] = useState([]);

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallListing();
      setSelectedStore();
    }
  });

  async function setSelectedStore() {
    const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    if (id != null) {
      setStoreIndex(JSON.parse(id));
    }
  }

  const APICallListing = () => {
    setLoader(true);
    const apiClass = new APICallService(STORE_LOCATOR, { limit: -1 });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          const list = [...res.data.items];
          let tempList = [];
          for (const key in list) {
            if (list.hasOwnProperty(key)) {
              const element = list[key];
              if (element.is_active == 1) {
                tempList.push(element);
              }
            }
          }

          setStoreListing(tempList);
          //setSearchStoreListing(tempList);
          let pinList = [];
          for (const key in tempList) {
            if (tempList.hasOwnProperty(key)) {
              const element = tempList[key];
              pinList = [...pinList, ...element.servicable_pincodes];
            }
          }
          if (pinList.length > 0)
            pinList = pinList.filter((value, index, self) => {
              return self.indexOf(value) === index;
            });

          setPinCodeList(pinList);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  async function searchFilter(text) {
    setSearchText(text);
    if (storeListing.length > 0) {
      let filteredList = storeListing.filter(function (item) {
        return item.servicable_pincodes.includes(text);
      });
      if (text.length == 0) {
        setSearchStoreListing(storeListing);
      } else {
        setSearchStoreListing(filteredList);
      }
    }
  }

  const renderStoreItem = ({ item, index }) => {
    let isActive = false;
    if (storeIndex != null) {
      isActive = storeIndex == item?.id;
    }
    return (
      <TouchableOpacity
        style={[
          styles.listView,
          {
            borderColor: isActive ? Colors.Background : Colors.storeBorderColor,
            backgroundColor: isActive ? Colors.pinkBack : Colors.white,
          },
        ]}
        onPress={async () => {
          setStoreIndex(item?.id);
          await AsyncStorageLib.setItem(
            PREF_STORE_ID,
            JSON.stringify(item?.id)
          );
          props.navigation.goBack();
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.ShopNameText}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${item.phone}`);
            }}
          >
            <Image
              source={Images.call}
              resizeMode={"contain"}
              style={styles.usericon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text1}>
          {item.address_line_1 + ", " + item.address_line_2}
        </Text>
        <Text style={styles.text1}>{item.city}</Text>
        <Text style={styles.text1}>{item.state}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header
        navigation={props.navigation}
        isBack
        isBackVisible={storeIndex != null}
        isLocation
      />
      <Loader2 modalVisible={isShowLoader} />
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
        <CustomInput
          input={styles.input}
          keyboardType={"numeric"}
          onChangeText={(text) => searchFilter(text)}
        />
        {searchStoreListing.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchStoreListing}
            renderItem={renderStoreItem}
            style={styles.storeList}
          />
        ) : (
          <NoDataView
            isLoader={isShowLoader}
            isVisible={searchStoreListing.length == 0}
            title={Strings.No_Stores_Suggestion}
            containerStyle={{ marginTop: Size.FindSize(50) }}
            pinCodeList={pinCodeList}
          />
        )}
      </View>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
