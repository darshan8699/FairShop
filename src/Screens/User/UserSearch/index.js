//import liraries
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomInput from "../../../Components/CustomInput";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import Colors from "../../../Utility/Colors";
import { PREF_STORE_ID, PRODUCT_LIST } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [newData, setNewData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isShowLoader, setLoader] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetNewProductData("");
    }
  });
  const GetNewProductData = async (search, isLoader = true) => {
    const store_id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setLoader(isLoader);
    setSearching(search.length > 0);
    const apiClass = new APICallService(PRODUCT_LIST, {
      limit: -1,
      store_id: store_id,
      search: search,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        setSearching(false);
        if (res.code === 0) {
          setNewData(res.data.items);
          setSearchData(res.data.items);
        } else {
          setNewData([]);
          setSearchData([]);
        }
      })
      .catch((err) => {
        setLoader(false);
        setSearching(false);
        showErrorMessage(err.message);
        setNewData([]);
        setSearchData([]);
      });
  };

  const searchFilter = (text) => {
    // let filteredList = searchData.filter(function (item) {
    //   return item.item_name.toLowerCase().includes(text.toLowerCase());
    // });
    // if (text.length == 0) {
    //   setSearchData(newData);
    // } else {
    //   setSearchData(filteredList);
    // }
    GetNewProductData(text, false);
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />

      <View style={styles.childContainer}>
        <CustomInput
          placeHolder="Search"
          RightIcon={"search"}
          onChangeText={(text) => searchFilter(text)}
        />
      </View>
      {isSearching && (
        <View
          style={{
            justifyContent: "center",
            padding: Size.FindSize(20),
          }}
        >
          <ActivityIndicator size="large" color={Colors.Background} />
        </View>
      )}

      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: Size.FindSize(15),
          paddingBottom: Size.FindSize(20),
        }}
        data={searchData}
        style={styles.list}
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.listView}
            // addToWishList={(id) => addToWishList(id)}
          />
        )}
        nestedScrollEnabled={false}
      />
      <NoDataView
        isVisible={searchData.length == 0}
        title={Strings.No_data_found}
        containerStyle={{ height: Size.height / 2.5 }}
        isLoader={isShowLoader}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
