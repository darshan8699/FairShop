import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View, TouchableOpacity } from "react-native";

import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import { Route } from "../../../Navigation/Routes";
import {
  CATEGORY,
  NO_IMAGE_URL,
  PREF_STORE_ID,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Navigator from "../../../Utility/Navigator";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [newData, setNewData] = useState([]);
  const [isShowLoader, setLoader] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetNewProductData();
    }
  });
  const GetNewProductData = async () => {
    setLoader(true);
    const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    const apiClass = new APICallService(CATEGORY, {
      limit: -1,
      store_id: id,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          var tList = [];
          const temp = res.data.items;
          for (const key in temp) {
            if (temp.hasOwnProperty(key)) {
              const element = temp[key].children;
              for (const key in element) {
                const element2 = element[key];
                tList.push(element2);
              }
            }
          }
          setNewData(tList);
        } else {
          setNewData([]);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const renderBrowseCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.browseCard}
      activeOpacity={1}
      onPress={() => {
        console.log("123");
        Navigator.navigate(Route.ShopCategoryWise, { categoryDetail: item });
      }}
    >
      <View style={styles.browseCardView}>
        <Image
          source={{
            uri:
              item.icon && item.icon[0].url ? item.icon[0].url : NO_IMAGE_URL,
          }}
          style={styles.browseImage}
        />
        <Text
          style={styles.browseCategoryText}
          numberOfLines={2}
          ellipsizeMode={"tail"}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isRightIcon={false} isBack /> */}
      <Text style={styles.headerText}>{Strings.BrowseText}</Text>
      <Loader2 modalVisible={isShowLoader} />
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: Size.FindSize(15),
          paddingBottom: Size.FindSize(20),
        }}
        data={newData}
        style={styles.list}
        renderItem={renderBrowseCategory}
        nestedScrollEnabled={false}
        showsHorizontalScrollIndicator={false}
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
