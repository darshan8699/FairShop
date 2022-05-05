import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import {
  COMBO_OFFERS,
  OFFERS,
  PREF_STORE_ID,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const Offers = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [offersList, setOffersList] = useState([]);
  const [loginInfo, setLoginInfo] = useState("");
  const [prefStoreId, setPrefStoreId] = useState("");
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      getLoginInfo();
      APICallOfferList();
    }
  });

  async function getLoginInfo() {
    const jsonValue = await AsyncStorageLib.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    setLoginInfo(loginInfo);
  }

  const APICallOfferList = async () => {
    setLoader(true);
    const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setPrefStoreId(id);
    const apiClass = new APICallService(COMBO_OFFERS, {
      store_id: id,
      categories: "combo",
      page: 1,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setOffersList(res.data?.data);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isBack isRightIcon={false} /> */}
      <Loader2 modalVisible={isShowLoader} />
      <Text style={styles.headerText}>{Strings.Offers}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: Size.FindSize(15),
          paddingBottom: Size.FindSize(20),
          paddingTop: 5,
        }}
        data={offersList}
        numColumns={2}
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.shadow}
            loginInfo={loginInfo ? true : false}
            storeId={prefStoreId}
          />
        )}
        // renderItem={({ item }) => (
        //   <View style={styles.listView}>
        //     <Image
        //       source={{ uri: item?.bannerImage }}
        //       style={styles.bestImage}
        //     />
        //     <View style={{ flex: 1, marginStart: Size.FindSize(10) }}>
        //       <Text style={styles.ShopNameText}>{item.couponCode}</Text>
        //       <Text style={styles.text1}>{item.description}</Text>
        //     </View>
        //   </View>
        // )}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

//make this component available to the app
export default Offers;
