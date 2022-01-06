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
    marginVertical: Size.FindSize(20),
    paddingHorizontal: Size.FindSize(15),
  },
  buttonView: {
    flexDirection: "row",
    marginHorizontal: Size.FindSize(15),
  },
  icon: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
  },
  text: {
    fontFamily: Regular,
    color: Colors.forgotText,
    fontSize: Size.FindSize(16),
    marginLeft: Size.FindSize(10),
  },
  line: {
    backgroundColor: Colors.line,
    height: Size.FindSize(1),
    marginHorizontal: Size.FindSize(15),
    marginVertical: Size.FindSize(15),
  },
});
