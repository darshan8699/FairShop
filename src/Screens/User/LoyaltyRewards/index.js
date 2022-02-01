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
import * as Progress from "react-native-progress";
import Colors from "../../../Utility/Colors";

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
        Logger.log("res is ::", res.data);
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
      <ScrollView
        style={{
          marginBottom: Size.FindSize(20),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={Images.homeBG}
          style={styles.back}
          resizeMode="cover"
        >
          <Text style={styles.text}>{Strings.Loyalty_Rewards}</Text>
        </ImageBackground>
        <View style={styles.mainView}>
          <View style={styles.memberView}>
            <Text style={styles.memberText}>{Strings.Membership}</Text>
          </View>
          <View style={styles.pointView}>
            <View style={styles.progressView}>
              <Progress.Bar
                progress={data?.membership?.currentTierValue}
                height={Size.FindSize(10)}
                width={Size.FindSize(280)}
                color={Colors.Background}
                unfilledColor={Colors.progressColor}
                borderWidth={0}
              />
              <Text style={styles.percetageText}>
                {data?.membership?.currentTierValue * 100}%
              </Text>
            </View>
            <View style={styles.rowView}>
              <Text style={styles.tierText}>{Strings.Next_Tier}</Text>
              <View style={styles.goldView}>
                <TouchableOpacity style={styles.goldButton}>
                  <Text style={styles.goldText}>
                    {data?.membership?.nextTierName}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.tierText}>
                  {parseInt(data?.membership?.nextTierMilestone)} points to go
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.balanceText}>{Strings.Balances}</Text>
          <View style={styles.memberView}>
            <Text style={styles.memberText}>{Strings.Rewards}</Text>
          </View>
          <View style={styles.secondView}>
            <View>
              <Text style={styles.currencyText}>{Strings.Points}</Text>
              <Text style={styles.countText}>0</Text>
            </View>
            <View style={{ marginLeft: Size.width / 2 - Size.FindSize(50) }}>
              <Text style={styles.currencyText}>{Strings.Currency}</Text>
              <Text style={styles.countText}>0</Text>
            </View>
          </View>
          <View style={[styles.memberView, { marginTop: Size.FindSize(30) }]}>
            <Text style={styles.memberText}>{Strings.Gift}</Text>
          </View>
          <View
            style={[styles.secondView, { paddingBottom: Size.FindSize(40) }]}
          >
            <View>
              <Text style={styles.currencyText}>{Strings.Currency}</Text>
              <Text style={styles.countText}>0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
