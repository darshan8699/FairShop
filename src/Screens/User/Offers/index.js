//import liraries
import React from "react";
import { Text, View } from "react-native";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const Offers = (props) => {
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack isRightIcon={false} />
      <Text style={styles.headerText}>{Strings.Offers}</Text>
    </View>
  );
};

//make this component available to the app
export default Offers;
