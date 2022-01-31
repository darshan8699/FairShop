import { StyleSheet } from "react-native";
import Colors from "../../../Utility/Colors";
import { Size } from "../../../Utility/sizes";
import { Bold, Regular, SemiBold } from "../../../Assets/fonts";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  back: {
    height: Size.FindSize(180),
    marginTop: Size.FindSize(1),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: Size.FindSize(40),
    fontFamily: Bold,
    color: Colors.white,
  },
});
