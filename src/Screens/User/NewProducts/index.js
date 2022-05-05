import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import {
  HOMEPAGE_NEW_PRODUCT,
  PREF_STORE_ID,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [newData, setNewData] = useState([]);
  const [isShowLoader, setLoader] = useState(false);
  const [loginInfo, setLoginInfo] = useState("");
  const [prefStoreId, setPrefStoreId] = useState("");
  const isFirstRun = useRef(true);

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
    const apiClass = new APICallService(HOMEPAGE_NEW_PRODUCT, {
      store_id: store_id,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setNewData(res.data.items);
        } else {
          setNewData([]);
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
      <Text style={styles.headerText}>{Strings.NewProduct}</Text>
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
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.listView}
            loginInfo={loginInfo ? true : false}
            storeId={prefStoreId}
          />
        )}
        nestedScrollEnabled={false}
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
