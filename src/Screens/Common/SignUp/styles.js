import {StyleSheet} from 'react-native';
import {Size} from '../../../Utility/sizes';
import Colors from '../../../Utility/Colors';
import {Bold, Regular} from '../../../Assets/fonts';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Size.FindSize(15),
  },
  loginText: {
    fontSize: Size.FindSize(30),
    fontFamily: Bold,
    color: Colors.loginText,
    textAlign: 'center',
    marginTop: Size.FindSize(60),
  },
  button: {
    backgroundColor: Colors.Background,
    borderColor: Colors.Background,
    marginTop: Size.FindSize(40),
  },
  buttonText: {
    color: Colors.white,
  },
  button1: {
    backgroundColor: Colors.white,
    borderColor: Colors.Background,
    marginTop: Size.FindSize(10),
    marginBottom: Size.FindSize(40),
  },
  buttonText1: {
    color: Colors.Background,
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Size.FindSize(-25),
  },
  halfView: {
    width: Size.width / 2 - 20,
  },
});
