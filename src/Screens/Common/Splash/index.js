//import liraries
import React, { useEffect, useRef } from "react";
import { View, Image } from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import { Images } from "../../../Assets/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "../../../Utility/Logger";

// create a component
const MyComponent = (props) => {
  Navigator.setContainer(props.navigation);
  useEffect(() => {
    initialCalls();
  }, []);
  const initialCalls = async () => {
    const jsonValue = await AsyncStorage.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });
    setTimeout(() => {
      if (loginInfo) {
        Navigator.resetFrom(Route.DrawerApp);
      } else {
        Navigator.resetFrom(Route.Login);
      }
    }, 5000);
  };
  return (
    <View style={styles.container}>
      <Image source={Images.logo} resizeMode={"contain"} style={styles.logo} />
      <Image
        source={Images.fruits}
        resizeMode={"contain"}
        style={styles.fruits}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
