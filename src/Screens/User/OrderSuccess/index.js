//import liraries
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [userId, setUserId] = useState(null);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    }
  });

  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} isBackVisible={false} />

      <Loader2 modalVisible={isShowLoader} />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          marginTop: -100,
        }}
      >
        <Text style={styles.headerText}>{Strings.OrderPlacedSuccessfully}</Text>
        <Text style={styles.loginText2}>
          {"Order #" + props.route.params.order_id + " with tracking id "}
          <Text style={styles.headerText2}>
            {props.route.params.tracking_number}
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.loginView}
          onPress={() => Navigator.navigate(Route.UserHome)}
        >
          <Text style={styles.loginText}>{Strings.ContinueShopping}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
