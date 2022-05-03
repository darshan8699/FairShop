//import liraries
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import { LOYALTY_INQUIRY } from "../../../Utility/Constants";
import { showErrorMessage } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [loyaltyData, setLoyaltyData] = useState(null);
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
        setLoyaltyData(res.data);
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

      <ScrollView
        style={{
          paddingBottom: Size.FindSize(20),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainView}>
          <Text style={styles.headerText}>{Strings.Loyalty_Rewards}</Text>
          <View style={styles.memberView}>
            <Text style={styles.memberText}>{Strings.Membership}</Text>
          </View>
          <View style={styles.pointView}>
            <View style={styles.progressView}>
              <Progress.Bar
                progress={loyaltyData?.membership?.currentTierValue}
                height={Size.FindSize(10)}
                width={Size.FindSize(280)}
                color={Colors.Background}
                unfilledColor={Colors.progressColor}
                borderWidth={0}
              />
              <Text style={styles.percetageText}>
                {loyaltyData?.membership?.currentTierValue * 100}%
              </Text>
            </View>
            <View style={styles.rowView}>
              <Text style={styles.tierText}>{Strings.Next_Tier}</Text>
              <View style={styles.goldView}>
                <TouchableOpacity style={styles.goldButton}>
                  <Text style={styles.goldText}>
                    {loyaltyData?.membership?.tierName}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.tierText, { justifyContent: "center" }]}>
                  {loyaltyData?.membership?.nextTierMilestone
                    ? parseInt(loyaltyData?.membership?.nextTierMilestone)
                    : 0}{" "}
                  points to go
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
              <Text style={styles.countText}>
                {loyaltyData ? loyaltyData?.balances[0].amount : 0}
              </Text>
            </View>
            <View style={{ marginLeft: Size.width / 2 - Size.FindSize(50) }}>
              <Text style={styles.currencyText}>{Strings.Currency}</Text>
              <Text style={styles.countText}>
                {loyaltyData
                  ? loyaltyData?.balances[1].amount > 0
                    ? loyaltyData?.balances[1].amount
                    : 0
                  : 0}
              </Text>
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
              <Text style={styles.countText}>
                {loyaltyData
                  ? loyaltyData?.balances[2].amount > 0
                    ? loyaltyData?.balances[2].amount
                    : 0
                  : 0}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
