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
  listView: {
    flexDirection: "row",
    paddingVertical: Size.FindSize(15),
    paddingHorizontal: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    marginHorizontal: Size.FindSize(15),
    borderColor: Colors.storeBorderColor,
    backgroundColor: Colors.white,
    marginTop: Size.FindSize(10),
  },
  bestImage: {
    height: Size.FindSize(100),
    width: Size.FindSize(150),
    borderRadius: Size.FindSize(10),
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
  priceText: {
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(16),
  },
});
