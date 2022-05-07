import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Regular, SemiBold } from "../../../Assets/fonts";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  line: {
    height: Size.FindSize(0.5),
    backgroundColor: Colors.headerline,
    marginVertical: Size.FindSize(20),
  },
  horizontalView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Size.FindSize(5),
  },
  boldText: {
    fontFamily: SemiBold,
    fontSize: Size.FindSize(16),
    marginBottom: Size.FindSize(3),
    color: Colors.black,
  },
  greyText: {
    color: Colors.orderText,
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
  },
  redText: {
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
  },
  priceText1: {
    textDecorationLine: "line-through",
    color: Colors.forgotText,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    marginLeft: Size.FindSize(5),
  },
  normalText: {
    color: Colors.orderText,
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
    // marginBottom: Size.FindSize(20),
  },
  smallText: {
    color: Colors.orderText,
    fontFamily: Regular,
    fontSize: Size.FindSize(12),
  },
  itemView: {
    height: Size.FindSize(60),
    backgroundColor: Colors.itemBack,
    justifyContent: "center",
    borderTopWidth: Size.FindSize(0.5),
    borderBottomWidth: Size.FindSize(0.5),
    borderTopColor: Colors.headerline,
    borderBottomColor: Colors.headerline,
    paddingHorizontal: Size.FindSize(15),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRenderView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Size.FindSize(20),
    borderBottomColor: Colors.headerline,
    borderBottomWidth: Size.FindSize(0.5),
    padding: Size.FindSize(15),
  },
  itemImage: {
    height: Size.FindSize(70),
    width: Size.FindSize(70),
    marginRight: Size.FindSize(15),
  },
  itemText: {
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
    marginRight: Size.FindSize(15),
    width: Size.FindSize(230),
    color: Colors.headerText,
    textAlignVertical: "center",
  },
  childContainer: {
    padding: Size.FindSize(15),
  },
});
