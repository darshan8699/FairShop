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
});
