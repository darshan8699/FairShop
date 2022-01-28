import { StyleSheet } from "react-native";
import { SemiBold } from "../../../Assets/fonts";
import Colors from "../../../Utility/Colors";
import { Size } from "../../../Utility/sizes";

// define your styles
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  childContainer: {
    padding: Size.FindSize(15),
  },
  list: {
    marginHorizontal: Size.FindSize(5),
  },
  listView: { backgroundColor: "#0000" },
});
