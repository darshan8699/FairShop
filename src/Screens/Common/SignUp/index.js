//import liraries
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import styles from './styles';
import {Route} from '../../../Navigation/Routes';
import Navigator from '../../../Utility/Navigator';
import AuthHeader from '../../../Components/AuthHeader';
import CustomText from '../../../Components/CustomText';
import CustomInput from '../../../Components/CustomInput';
import CustomButton from '../../../Components/CustomButton';
import Strings from '../../../Utility/Strings';

// create a component
const MyComponent = props => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader />
        <Text style={styles.loginText}>{Strings.Sign_Up}</Text>
        <View style={styles.nameView}>
          <View style={styles.halfView}>
            <CustomText name={Strings.First_Name} />
            <CustomInput onChangeText={text => setFirstname(text)} />
          </View>
          <View style={styles.halfView}>
            <CustomText name={Strings.Last_Name} />
            <CustomInput onChangeText={text => setLastname(text)} />
          </View>
        </View>
        <CustomText name={Strings.Email} />
        <CustomInput onChangeText={text => setEmail(text)} />
        <CustomText name={Strings.Phone} />
        <CustomInput onChangeText={text => setPhone(text)} />
        <CustomText name={Strings.Password} />
        <CustomInput
          RightIcon={showPassword ? 'eye-slash' : 'eye'}
          secureTextEntry={showPassword}
          onRightButtonPress={() => setShowPassword(!showPassword)}
          onChangeText={text => setPassword(text)}
        />
        <CustomButton
          text={Strings.Sign_Up}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => {
            Navigator.navigate(Route.DrawerApp);
          }}
        />
        <CustomButton
          text={Strings.Login}
          style={styles.button1}
          textStyle={styles.buttonText1}
          onPress={() => {
            Navigator.navigate(Route.Login);
          }}
        />
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
