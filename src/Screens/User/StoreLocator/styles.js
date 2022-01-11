import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Regular, SemiBold, Medium } from "../../../Assets/fonts";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  childContainer: {
    paddingHorizontal: Size.FindSize(15),
    flex: 1,
  },
  headerText: {
    fontSize: Size.FindSize(24),
    fontFamily: SemiBold,
    color: Colors.headerText,
    marginTop: Size.FindSize(20),
    marginBottom: Size.FindSize(10),
  },
  pincodeView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Size.FindSize(5),
  },
  pincodeImage: {
    height: Size.FindSize(20),
    width: Size.FindSize(20),
  },
  text: {
    fontSize: Size.FindSize(16),
    fontFamily: Medium,
    color: Colors.pincodetext,
    marginLeft: Size.FindSize(5),
  },
  input: {
    paddingHorizontal: Size.FindSize(15),
  },
  listView: {
    paddingVertical: Size.FindSize(30),
    paddingHorizontal: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    marginBottom: Size.FindSize(15),
  },
  storeList: {
    marginTop: Size.FindSize(30),
  },
  ShopNameText: {
    fontSize: Size.FindSize(16),
    fontFamily: SemiBold,
    color: Colors.storeColor,
    marginBottom: Size.FindSize(3),
  },
  text1: {
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    color: Colors.pincodetext,
  },
});
