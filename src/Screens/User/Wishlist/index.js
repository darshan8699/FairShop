import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { ALL_WISHLIST, WHISHLIST } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

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
          const wishListArr = res.data.items[0].products;
          let array = [];
          setWhishList(wishListArr);
          for (const key in wishListArr) {
            if (wishListArr.hasOwnProperty(key)) {
              const element = wishListArr[key];
              array.push(element.item_code);
            }
          }
          AsyncStorageLib.setItem(ALL_WISHLIST, JSON.stringify(array));
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
            // addToWishList={(id) => addToWishList(id)}
          />
        )}
      />
    </View>
  );
};

//make this component available to the app
export default Wishlist;
