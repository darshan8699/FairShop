//import liraries
import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
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

  return (
    <View style={styles.container}>
      <AuthHeader />
      <Text style={styles.loginText}>{Strings.Login}</Text>
      <CustomText name={Strings.Email_or_Phone} />
      <CustomInput onChangeText={text => setEmail(text)} />
      <CustomText name={Strings.Password} />
      <CustomInput
        RightIcon={showPassword ? 'eye-slash' : 'eye'}
        secureTextEntry={showPassword}
        onRightButtonPress={() => setShowPassword(!showPassword)}
        onChangeText={text => setPassword(text)}
      />
      <Text style={styles.forgotText}>{Strings.Forgot_Password}</Text>
      <View style={styles.buttonView}>
        <CustomButton
          text={Strings.LoginWithOTP}
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => {}}
        />
        <CustomButton
          text={Strings.Login}
          style={styles.button1}
          textStyle={styles.buttonText1}
          onPress={() => {
            Navigator.navigate(Route.DrawerApp);
          }}
        />
      </View>
      <CustomButton
        text={Strings.Sign_Up}
        style={styles.button2}
        textStyle={styles.buttonText2}
        onPress={() => {
          Navigator.navigate(Route.SignUp);
        }}
      />
    </View>
  );
};

//make this component available to the app
export default MyComponent;
