import { StyleSheet } from "react-native";
import { SemiBold } from "../../../Assets/fonts";
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
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Size.FindSize(15),
  },
  headerText: {
    fontSize: Size.FindSize(24),
    fontFamily: SemiBold,
    color: Colors.headerText,
    marginVertical: Size.FindSize(20),
    paddingHorizontal: Size.FindSize(15),
  },
});
