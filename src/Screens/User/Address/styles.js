import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Regular, SemiBold } from "../../../Assets/fonts";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerText: {
    fontSize: Size.FindSize(24),
    fontFamily: SemiBold,
    color: Colors.headerText,
    marginTop: Size.FindSize(20),
  },
  button: {
    backgroundColor: Colors.Background,
    borderColor: Colors.Background,
    //width: Size.width / 2 - 20,
    flex: 1,
    marginVertical: Size.FindSize(30),
  },
  buttonText: {
    color: Colors.white,
  },
  text: {
    color: Colors.text,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    marginTop: Size.FindSize(30),
  },
  dropdown: {
    height: Size.FindSize(50),
    backgroundColor: Colors.white,
    paddingHorizontal: Size.FindSize(15),
    borderColor: Colors.borderColor,
    borderWidth: Size.FindSize(1),
    marginTop: Size.FindSize(8),
    marginBottom: Size.FindSize(-10),
  },
  selectedTextStyle: {
    color: Colors.text,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
  },
});
