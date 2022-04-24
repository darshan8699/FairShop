//import liraries
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import { Images } from "../../../Assets/images";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import styles from "./styles";
import LottieView from "lottie-react-native";

// create a component
const MyComponent = (props) => {
  Navigator.setContainer(props.navigation);
  useEffect(() => {
    initialCalls();
  }, []);
  const initialCalls = async () => {
    // const jsonValue = await AsyncStorage.getItem("loginInfo");
    // const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    // Logger.log({ loginInfo });
    setTimeout(() => {
      Navigator.resetFrom(Route.DrawerApp);
      // if (loginInfo) {
      //   Navigator.resetFrom(Route.DrawerApp);
      // } else {
      //   Navigator.resetFrom(Route.Login);
      // }
    }, 5000);
  };
  return (
    <View style={styles.container}>
      {/* <Image source={Images.logo} resizeMode={"contain"} style={styles.logo} /> */}
      <LottieView
        source={require("../../../Assets/imageuploading.json")}
        loop={false}
        autoPlay={true}
        style={styles.logo}
      />
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
