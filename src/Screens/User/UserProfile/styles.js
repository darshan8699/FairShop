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
  loginView: {
    flexDirection: "row",
    marginHorizontal: Size.FindSize(15),
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: Size.FindSize(2),
    padding: Size.FindSize(10),
    borderColor: Colors.Background,
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
  loginText: {
    fontFamily: Regular,
    color: Colors.Background,
    fontSize: Size.FindSize(16),
    paddingHorizontal: Size.FindSize(30),
  },
  loginText2: {
    fontFamily: Regular,
    color: Colors.headerText,
    fontSize: Size.FindSize(16),
    paddingHorizontal: Size.FindSize(30),
    marginBottom: Size.FindSize(20),
    textAlign: "center",
  },
  line: {
    backgroundColor: Colors.line,
    height: Size.FindSize(1),
    marginHorizontal: Size.FindSize(15),
    marginVertical: Size.FindSize(15),
  },
});
