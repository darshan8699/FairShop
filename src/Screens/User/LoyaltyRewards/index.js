//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { LOYALTY_INQUIRY } from "../../../Utility/Constants";
import {
  showSuccessMessage,
  showErrorMessage,
  validateResponse,
} from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import styles from "./styles";
import Logger from "../../../Utility/Logger";
import Strings from "../../../Utility/Strings";
import { Images } from "../../../Assets/images";

// create a component
const MyComponent = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallList();
    }
  });

  const APICallList = () => {
    setLoader(true);
    const apiClass = new APICallService(LOYALTY_INQUIRY);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        setData(res.data);
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
      <ImageBackground source={Images.homeBG} style={styles.back}>
        <Text style={styles.text}>{Strings.Loyalty_Rewards}</Text>
      </ImageBackground>
      <ScrollView>
        <View>
          <Text>{Strings.Membership}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
