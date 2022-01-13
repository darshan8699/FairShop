//import liraries
import React from "react";
import { Text, View, ScrollView } from "react-native";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import CustomInput from "../../../Components/CustomInput";
import { Size } from "../../../Utility/sizes";

// create a component
const MyComponent = (props) => {
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} />
      <ScrollView
        style={{
          padding: Size.FindSize(15),
        }}
      >
        <CustomInput placeHolder="Search" RightIcon={"search"} />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
