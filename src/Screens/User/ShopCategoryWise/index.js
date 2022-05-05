import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import { PREF_STORE_ID, PRODUCT_LIST } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../../Utility/Colors";

const data = [
  { label: "Price - Low to High", value: "Price - Low to High" },
  { label: "Price - High to Low", value: "Price - High to Low" },
  { label: "Name - A to Z", value: "Name - A to Z" },
  { label: "Name - Z to A", value: "Name - Z to A" },
];
// create a component
const MyComponent = (props) => {
  const [newData, setNewData] = useState([]);
  const [isShowLoader, setLoader] = useState(false);
  const isFirstRun = useRef(true);
  const dropdownRef = useRef();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loginInfo, setLoginInfo] = useState("");
  const [prefStoreId, setPrefStoreId] = useState("");

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      getLoginData();
      GetNewProductData();
    }
  });

  async function getLoginData() {
    const jsonValue = await AsyncStorageLib.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    setLoginInfo(loginInfo);
  }
  const GetNewProductData = async () => {
    setLoader(true);
    const store_id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setPrefStoreId(store_id);
    const apiClass = new APICallService(PRODUCT_LIST, {
      page: 1,
      categories: props.route.params.categoryDetail.slug,
      store_id: store_id,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setNewData(res.data.data);
        } else {
          setNewData([]);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const getData = () => {
    if (selectedFilter == "") {
      return newData;
    } else if (selectedFilter == "Price - Low to High") {
      return newData?.sort((a, b) => (a.rsp > b.rsp ? 1 : -1));
    } else if (selectedFilter == "Price - High to Low") {
      return newData?.sort((a, b) => (a.rsp > b.rsp ? -1 : 1));
    } else if (selectedFilter == "Name - A to Z") {
      return newData?.sort((a, b) =>
        a.item_name.toUpperCase() > b.item_name.toUpperCase() ? 1 : 1
      );
    } else if (selectedFilter == "Name - Z to A") {
      return newData?.sort((a, b) =>
        a.item_name.toUpperCase() > b.item_name.toUpperCase() ? -1 : 1
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isRightIcon={false} isBack /> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={[
              styles.headerText,
              {
                width: selectedFilter
                  ? Size.width - Size.FindSize(155)
                  : Size.width - Size.FindSize(115),
              },
            ]}
          >
            {props.route.params.categoryDetail.name}
          </Text>
        </View>
        <Dropdown
          ref={dropdownRef}
          style={{
            height: Size.FindSize(30),
            borderColor: Colors.button,
            borderWidth: Size.FindSize(1),
            borderRadius: Size.FindSize(5),
            paddingHorizontal: Size.FindSize(8),
            marginRight: Size.FindSize(20),
            marginVertical: Size.FindSize(20),
            width: selectedFilter ? Size.FindSize(140) : Size.FindSize(100),
            color: Colors.button,
          }}
          placeholderStyle={{
            fontSize: Size.FindSize(12),
            color: Colors.button,
          }}
          showsVerticalScrollIndicator={false}
          selectedTextStyle={{
            fontSize: Size.FindSize(12),
            color: Colors.button,
          }}
          iconStyle={{ width: Size.FindSize(20), height: Size.FindSize(20) }}
          data={data}
          search={false}
          maxHeight={Size.FindSize(200)}
          labelField="label"
          valueField="value"
          placeholder={"Sort by"}
          value={selectedFilter}
          onChange={(item) => {
            setSelectedFilter(item.value);
          }}
          renderRightIcon={() => (
            <AntDesign
              style={styles.icon}
              color={Colors.button}
              name={selectedFilter ? "close" : "down"}
              size={10}
              onPress={() => {
                if (selectedFilter != "") {
                  setSelectedFilter("");
                } else dropdownRef.current.open();
              }}
            />
          )}
        />
      </View>

      <Loader2 modalVisible={isShowLoader} />
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: Size.FindSize(15),
          paddingBottom: Size.FindSize(20),
        }}
        data={getData()}
        style={styles.list}
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.listView}
            loginInfo={loginInfo ? true : false}
            storeId={prefStoreId}
            // addToWishList={(id) => addToWishList(id)}
          />
        )}
      />
      <NoDataView
        isVisible={newData.length == 0}
        title={Strings.No_data_found}
        containerStyle={{ height: Size.height / 2.5 }}
        isLoader={isShowLoader}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
