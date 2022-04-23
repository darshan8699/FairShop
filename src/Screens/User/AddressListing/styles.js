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
    width: "80%",
  },
  icon: {
    height: Size.FindSize(15),
    width: Size.FindSize(15),
    marginLeft: Size.FindSize(30),
    tintColor: Colors.button,
  },
  editIcon: {
    height: Size.FindSize(15),
    width: Size.FindSize(15),
    tintColor: Colors.button,
  },
  nameView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Size.FindSize(10),
  },
  infoView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Size.FindSize(10),
  },
  typeText: {
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    color: Colors.Background,
  },
  backView: {
    padding: Size.FindSize(5),
    backgroundColor: Colors.pinkBack,
    marginRight: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    borderRadius: Size.FindSize(5),
    borderColor: Colors.Background,
  },
  userView: {
    padding: Size.FindSize(5),
    backgroundColor: Colors.white,
    marginRight: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    borderRadius: Size.FindSize(5),
    borderColor: Colors.button,
    flexDirection: "row",
    alignItems: "center",
  },
  usericon: {
    height: Size.FindSize(15),
    width: Size.FindSize(15),
    marginRight: Size.FindSize(7),
    tintColor: Colors.button,
  },
  listView1: {
    paddingVertical: Size.FindSize(20),
    paddingHorizontal: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    marginBottom: Size.FindSize(15),
  },
});
