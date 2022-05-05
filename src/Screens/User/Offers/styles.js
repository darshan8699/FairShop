import { StyleSheet } from "react-native";
import { Regular, SemiBold } from "../../../Assets/fonts";
import Colors from "../../../Utility/Colors";
import { Size } from "../../../Utility/sizes";

// define your styles
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
  bestImage: {
    height: Size.FindSize(100),
    width: Size.FindSize(150),
    borderRadius: Size.FindSize(10),
  },
  listView: {
    flexDirection: "row",
    paddingVertical: Size.FindSize(15),
    paddingHorizontal: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    marginHorizontal: Size.FindSize(15),
    borderColor: Colors.storeBorderColor,
    backgroundColor: Colors.white,
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
  shadow: {
    // shadowColor: Colors.black,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,
    // elevation: 3,
    marginTop: 0,
    backgroundColor: "#0000",
  },
});
