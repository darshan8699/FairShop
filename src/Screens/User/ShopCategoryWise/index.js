//import liraries
import React, { useEffect, useRef, useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import CustomItemView from "../../../Components/CustomItemView";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import { HOMEPAGE_NEW_PRODUCT } from "../../../Utility/Constants";
import Loader2 from "../../../Components/Loader2";
import APICallService from "../../../API/APICallService";
import Logger from "../../../Utility/Logger";

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
          <CustomItemView item={item} listView={styles.listView} />
        )}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
