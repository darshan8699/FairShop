//import liraries
import React, {Component} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Size} from '../Utility/sizes';
import Colors from '../Utility/Colors';
import {Regular} from '../Assets/fonts';

// create a component
const CustomInput = props => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={props.placeHolder}
        style={styles.input}
        secureTextEntry={props.secureTextEntry}
        onChangeText={text => props.onChangeText(text)}
        keyboardType={props.keyboardType ? props.keyboardType : 'default'}
      />
      {props.RightIcon ? (
        <FontAwesome5
          name={props.RightIcon}
          size={18}
          style={styles.RightIcon}
          onPress={() => props.onRightButtonPress()}
        />
      ) : null}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(50),
  },
  input: {
    height: Size.FindSize(50),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Size.FindSize(15),
    borderColor: Colors.borderColor,
    borderWidth: Size.FindSize(1),
    marginTop: Size.FindSize(8),
  },
  RightIcon: {
    position: 'absolute',
    right: Size.FindSize(15),
    top: Size.FindSize(25),
    color: '#838E92',
  },
});

//make this component available to the app
export default CustomInput;
