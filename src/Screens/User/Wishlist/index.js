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
  ALL_WISHLIST,
  PREF_STORE_ID,
  WHISHLIST,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const Wishlist = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [whishList, setWhishList] = useState([]);
  const [page, setPage] = useState(1);
  const [prefStoreId, setPrefStoreId] = useState("");
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallWishList();
    }
    const unsubscribe = props.navigation.addListener("focus", async () => {
      const store_id = await AsyncStorageLib.getItem(PREF_STORE_ID);
      setPrefStoreId(store_id);
      APICallWishList();
    });
    return () => unsubscribe();
  }, [props.currentFocus]);

  const APICallWishList = () => {
    setLoader(true);
    const apiClass = new APICallService(WHISHLIST, {
      // page: page,
      limit: -1,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          if (res.data.items.length > 0) {
            const wishListArr = res.data.items[0].products;
            let array = [];
            setWhishList(wishListArr);
            for (const key in wishListArr) {
              if (wishListArr.hasOwnProperty(key)) {
                const element = wishListArr[key];
                array.push(element.item_code);
              }
            }
            await AsyncStorageLib.setItem(ALL_WISHLIST, JSON.stringify(array));
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} />
      {/* <Header isBack navigation={props.navigation} isRightIcon={false} /> */}
      <Loader2 modalVisible={isShowLoader} />

      <Text style={styles.headerText}>{Strings.Wishlist}</Text>

      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: Size.FindSize(15),
          paddingBottom: Size.FindSize(20),
        }}
        data={whishList}
        style={styles.list}
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.listView}
            onRefresh={() => APICallWishList()}
            storeId={prefStoreId}
            // addToWishList={(id) => addToWishList(id)}
          />
        )}
      />
      <NoDataView
        isVisible={whishList.length == 0}
        title={Strings.No_data_found}
        containerStyle={{ height: Size.height / 2 }}
        isLoader={isShowLoader}
      />
    </View>
  );
};

//make this component available to the app
export default Wishlist;
