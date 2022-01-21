//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomInput from "../../../Components/CustomInput";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { HOMEPAGE_NEW_PRODUCT } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [newData, setNewData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isShowLoader, setLoader] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetNewProductData();
    }
  });
  const GetNewProductData = () => {
    setLoader(true);
    const apiClass = new APICallService(HOMEPAGE_NEW_PRODUCT);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setNewData(res.data.items);
          setSearchData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const searchFilter = (text) => {
    let filteredList = searchData.filter(function (item) {
      return item.item_name.toLowerCase().includes(text.toLowerCase());
    });
    if (text.length == 0) {
      setSearchData(newData);
    } else {
      setSearchData(filteredList);
    }
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
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 15 }}
        data={searchData}
        style={styles.list}
        renderItem={({ item }) => (
          <CustomItemView item={item} listView={styles.listView} />
        )}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
