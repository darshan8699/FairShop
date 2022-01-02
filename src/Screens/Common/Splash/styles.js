import {StyleSheet} from 'react-native';
import {Size} from '../../../Utility/sizes';
import Colors from '../../../Utility/Colors';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    alignItems: 'center',
  },
  logo: {
    height: Size.FindSize(200),
    width: Size.FindSize(300),
    marginTop: Size.FindSize(200),
  },
  fruits: {
    width: Size.width + Size.FindSize(80),
    height: Size.FindSize(250),
    position: 'absolute',
    bottom: 0,
  },
});
