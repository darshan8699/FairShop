//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../Components/Header";
// create a component
const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text>MyComponent</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

//make this component available to the app
export default MyComponent;
