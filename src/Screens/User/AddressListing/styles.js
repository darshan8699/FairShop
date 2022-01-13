import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Regular, SemiBold, Medium } from "../../../Assets/fonts";

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
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Size.FindSize(15),
  },
  addbuttonView: {
    paddingHorizontal: Size.FindSize(20),
    paddingVertical: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    borderColor: Colors.Background,
    borderStyle: "dashed",
  },
  addbuttontext: {
    color: Colors.Background,
  },
  addressList: {
    marginTop: Size.FindSize(20),
    paddingHorizontal: Size.FindSize(15),
  },
  listView: {
    paddingVertical: Size.FindSize(20),
    paddingHorizontal: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    marginBottom: Size.FindSize(15),
  },
  text1: {
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    color: Colors.pincodetext,
  },
  addressameText: {
    fontSize: Size.FindSize(16),
    fontFamily: SemiBold,
    color: Colors.storeColor,
    marginBottom: Size.FindSize(3),
  },
});
