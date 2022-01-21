//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import APICallService from "../../../API/APICallService";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { WHISHLIST } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
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
  });

  const APICallWishList = () => {
    setLoader(true);
    const apiClass = new APICallService(WHISHLIST, {
      page: page,
      limit: 5,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setWhishList(res.data.data);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: Size.FindSize(15) }}
        data={whishList}
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
export default Wishlist;
