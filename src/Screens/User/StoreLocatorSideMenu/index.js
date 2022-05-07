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
          setSearchStoreListing(tempList);
          let pinList = [];
          for (const key in tempList) {
            if (tempList.hasOwnProperty(key)) {
              const element = tempList[key];
              pinList = [...pinList, ...element.servicable_pincodes];
            }
          }
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
    let filteredList = storeListing.filter(function (item) {
      return item.servicable_pincodes.includes(text);
    });
    if (text.length == 0) {
      setSearchStoreListing(storeListing);
    } else {
      setSearchStoreListing(filteredList);
    }
  }

  const renderStoreItem = ({ item, index }) => {
    let isActive = false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.listView,
          {
            borderColor: isActive ? Colors.Background : Colors.storeBorderColor,
            backgroundColor: isActive ? Colors.pinkBack : Colors.white,
          },
        ]}
        // onPress={async () => {
        //   setStoreIndex(item?.id);
        //   await AsyncStorageLib.setItem(
        //     PREF_STORE_ID,
        //     JSON.stringify(item?.id)
        //   );
        //   props.navigation.goBack();
        // }}
      >
        <Image
          source={{ uri: item.image[0].thumbnail }}
          style={{
            height: Size.FindSize(150),
            width: "100%",
            marginBottom: Size.FindSize(10),
          }}
        />

        <Text style={styles.ShopNameText}>{item.name}</Text>
        <Text style={styles.text1}>
          {item.address_line_1 + ", " + item.address_line_2}
        </Text>
        <Text style={styles.text1}>
          {item.city + ", " + item.state + "-" + item.pincode}
        </Text>
        <Text style={styles.text1}></Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${item.phone}`);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Image
              source={Images.call}
              resizeMode={"contain"}
              style={styles.usericon}
            />
            <Text
              style={[
                styles.text1,
                { fontSize: Size.FindSize(18), color: Colors.Background },
              ]}
            >
              {item.phone}
            </Text>
          </TouchableOpacity>
          {item.tollfree_number ? (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${item.tollfree_number}`);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={Images.call}
                resizeMode={"contain"}
                style={styles.usericon}
              />
              <Text
                style={[
                  styles.text1,
                  { fontSize: Size.FindSize(18), color: Colors.Background },
                ]}
              >
                {item.tollfree_number}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <View style={styles.childContainer}>
        <Text style={styles.headerText}>{Strings.StoreLocator}</Text>
        {/* <View style={styles.pincodeView}>
          <Image
            source={Images.pincode}
            resizeMode="contain"
            style={styles.pincodeImage}
          />
          <Text style={styles.text}>{Strings.Enter_pincode}</Text>
        </View> */}
        {/* <CustomInput
          input={styles.input}
          keyboardType={"numeric"}
          onChangeText={(text) => searchFilter(text)}
        /> */}
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
