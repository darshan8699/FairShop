import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Regular } from "../../../Assets/fonts";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Size.FindSize(15),
    backgroundColor: Colors.white,
  },
  loginText: {
    fontSize: Size.FindSize(30),
    fontFamily: Bold,
    color: Colors.loginText,
    textAlign: "center",
    marginTop: Size.FindSize(80),
  },
  forgotText: {
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    color: Colors.forgotText,
    alignSelf: "flex-end",
    marginTop: Size.FindSize(45),
  },
  button: {
    backgroundColor: Colors.white,
    borderColor: Colors.Background,
    width: Size.width / 2 - 20,
  },
  buttonText: {
    color: Colors.Background,
  },
  button1: {
    backgroundColor: Colors.Background,
    borderColor: Colors.Background,
    width: Size.width / 2 - 20,
  },
  buttonText1: {
    color: Colors.white,
  },
  button2: {
    backgroundColor: Colors.white,
    borderColor: Colors.Background,
    marginBottom: Size.FindSize(45),
  },
  buttonText2: {
    color: Colors.Background,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Size.FindSize(45),
  },
});
