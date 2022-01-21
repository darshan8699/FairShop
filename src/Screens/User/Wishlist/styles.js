import { StyleSheet } from "react-native";
import Colors from "../../../Utility/Colors";
import { Size } from "../../../Utility/sizes";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listView: {},
  list: {
    marginHorizontal: Size.FindSize(5),
  },
});
