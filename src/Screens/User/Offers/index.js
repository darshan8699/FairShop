//import liraries
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { OFFERS } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const Offers = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [offersList, setOffersList] = useState([]);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallOfferList();
    }
  });

  const APICallOfferList = () => {
    setLoader(true);
    const apiClass = new APICallService(OFFERS, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setOffersList(res.data?.values[0]?.couponsNew);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
      <Loader2 modalVisible={isShowLoader} />
      <Text style={styles.headerText}>{Strings.Offers}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: Size.FindSize(15),
          paddingBottom: Size.FindSize(20),
        }}
        data={offersList}
        renderItem={({ item }) => (
          <View style={styles.listView}>
            <Image
              source={{ uri: item?.bannerImage }}
              style={styles.bestImage}
            />
            <View style={{ flex: 1, marginStart: Size.FindSize(10) }}>
              <Text style={styles.ShopNameText}>{item.couponCode}</Text>
              <Text style={styles.text1}>{item.description}</Text>
            </View>
          </View>
        )}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

//make this component available to the app
export default Offers;
