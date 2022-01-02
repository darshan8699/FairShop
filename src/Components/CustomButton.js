//import liraries
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Size} from '../Utility/sizes';
import {Regular} from '../Assets/fonts';

// create a component
const CustomButton = props => {
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={() => props.onPress()}>
      <Text style={[styles.buttonText, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  button: {
    height: Size.FindSize(53),
    justifyContent: 'center',
    marginVertical: Size.FindSize(5),
    borderWidth: Size.FindSize(1),
    borderRadius: Size.FindSize(5),
  },
  buttonText: {
    fontSize: Size.FindSize(14),
    textAlign: 'center',
    fontFamily: Regular,
  },
});

//make this component available to the app
export default CustomButton;
