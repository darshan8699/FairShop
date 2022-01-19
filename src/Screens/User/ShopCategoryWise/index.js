//import liraries
import React, { useEffect, useRef, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} isBack />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
