//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { ADD_WISHLIST, HOMEPAGE_NEW_PRODUCT } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
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
  const GetNewProductData = () => {
    setLoader(true);
    const apiClass = new APICallService(HOMEPAGE_NEW_PRODUCT);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("data is---", res.data.items);
          setNewData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const addToWishList = (product_item_code) => {
    Logger.log("product_item_code", product_item_code);
    setLoader(true);
    const apiClass = new APICallService(ADD_WISHLIST, {
      product_item_code: [product_item_code],
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} isBack />
      <Text style={styles.headerText}>
        {props.route.params.categoryDetail.name}
      </Text>
      <Loader2 modalVisible={isShowLoader} />
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 15 }}
        data={newData}
        style={styles.list}
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.listView}
            addToWishList={(id) => addToWishList(id)}
          />
        )}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
