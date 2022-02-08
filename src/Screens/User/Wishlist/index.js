//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View, Text } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import {
  WHISHLIST,
  ADD_WISHLIST,
  ALL_WISHLIST,
} from "../../../Utility/Constants";
import {
  showSuccessMessage,
  showErrorMessage,
  validateResponse,
} from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import styles from "./styles";
import Logger from "../../../Utility/Logger";
import Strings from "../../../Utility/Strings";

// create a component
const Wishlist = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [whishList, setWhishList] = useState([]);
  const [page, setPage] = useState(1);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallWishList();
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      Logger.log("focus");
      APICallWishList();
    });
    return () => unsubscribe();
  }, [props.currentFocus]);

  const APICallWishList = () => {
    setLoader(true);
    const apiClass = new APICallService(WHISHLIST, {
      page: page,
      limit: 10,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setWhishList(res.data.data[0].products);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  // const addToWishList = (product_item_code) => {
  //   Logger.log("product_item_code", product_item_code);
  //   AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
  //     const id = [product_item_code];
  //     if (result !== null && result != product_item_code) {
  //       var newIds = JSON.parse(result).concat(id);
  //       AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(newIds));
  //       setLoader(true);
  //       const apiClass = new APICallService(ADD_WISHLIST, {
  //         product_item_code: newIds,
  //       });
  //       apiClass
  //         .callAPI()
  //         .then(async function (res) {
  //           setLoader(false);
  //           if (validateResponse(res)) {
  //             showSuccessMessage(res.message);
  //           }
  //         })
  //         .catch((err) => {
  //           setLoader(false);
  //           showErrorMessage(err.message);
  //         });
  //       console.log("all wishlist---------", newIds);
  //     } else {
  //       AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(id));
  //       setLoader(true);
  //       const apiClass = new APICallService(ADD_WISHLIST, {
  //         product_item_code: id,
  //       });
  //       apiClass
  //         .callAPI()
  //         .then(async function (res) {
  //           setLoader(false);
  //           if (validateResponse(res)) {
  //             showSuccessMessage(res.message);
  //           }
  //         })
  //         .catch((err) => {
  //           setLoader(false);
  //           showErrorMessage(err.message);
  //         });
  //       Logger.log("single wishlist--------");
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />

      <Text style={styles.headerText}>{Strings.Wishlist}</Text>

      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: Size.FindSize(15) }}
        data={whishList}
        style={styles.list}
        renderItem={({ item }) => (
          <CustomItemView
            item={item}
            listView={styles.listView}
            // addToWishList={(id) => addToWishList(id)}
          />
        )}
      />
    </View>
  );
};

//make this component available to the app
export default Wishlist;
