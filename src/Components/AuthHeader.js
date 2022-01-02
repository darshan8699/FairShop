//import liraries
import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Size} from '../Utility/sizes';
import {Images} from '../Assets/images';

// create a component
const AuthHeader = props => {
  return (
    <View style={styles.container}>
      <Image
        source={Images.headerLogo}
        resizeMode={'contain'}
        style={styles.logo}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(70),
    marginVertical: Size.FindSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: Size.FindSize(70),
  },
});

//make this component available to the app
export default AuthHeader;
