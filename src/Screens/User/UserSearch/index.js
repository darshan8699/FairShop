//import liraries
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import { Route } from "../../../Navigation/Routes";
import Navigator from "../../../Utility/Navigator";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import { Images } from "../../../Assets/images";

// create a component
const MyComponent = (props) => {
  return <View style={styles.container}></View>;
};

//make this component available to the app
export default MyComponent;
