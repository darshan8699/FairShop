import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Regular, SemiBold } from "../../../Assets/fonts";

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
  icon: {
    height: Size.FindSize(78),
    width: Size.FindSize(85),
    borderWidth: Size.FindSize(1),
    borderColor: Colors.cookBorder,
  },
  cartItem: {
    borderRadius: Size.FindSize(10),
    backgroundColor: "#0000",
    padding: Size.FindSize(10),
    marginEnd: Size.FindSize(10),
  },
  listView: {
    flexDirection: "row",
    paddingHorizontal: Size.FindSize(10),
    justifyContent: "space-between",
  },
  line: {
    height: Size.FindSize(1),
    backgroundColor: Colors.line,
    marginHorizontal: Size.FindSize(15),
    marginVertical: Size.FindSize(10),
  },
  item: {
    color: Colors.headerText,
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
  },
  quantityText: {
    color: Colors.cookBorder,
    fontFamily: Regular,
    fontSize: Size.FindSize(12),
  },
  priceText: {
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
  },
  priceText2: {
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(18),
    textAlign: "right",
    flex: 1,
  },
  textView: {
    flex: 1,
    marginLeft: Size.FindSize(15),
  },
  minusButton: {
    height: Size.FindSize(28),
    width: Size.FindSize(28),
    backgroundColor: Colors.cookBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  countView: {
    height: Size.FindSize(28),
    width: Size.FindSize(47),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.cookBorder,
  },
  plusButton: {
    height: Size.FindSize(28),
    width: Size.FindSize(28),
    backgroundColor: Colors.Background,
    justifyContent: "center",
    alignItems: "center",
  },
  minusText: {
    fontSize: Size.FindSize(20),
    lineHeight: Size.FindSize(28),
    color: Colors.headerText,
    fontFamily: Regular,
  },
  countText: {
    fontSize: Size.FindSize(16),
    lineHeight: Size.FindSize(28),
    color: Colors.Background,
    fontFamily: Regular,
  },
  plusText: {
    fontSize: Size.FindSize(20),
    lineHeight: Size.FindSize(28),
    color: Colors.white,
    fontFamily: Regular,
  },
  countPanelView: {
    flexDirection: "row",
    // alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",

    borderColor: Colors.cookBorder,
    width: Size.FindSize(100),
  },
  subTotalView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: Size.FindSize(20),
    marginTop: Size.FindSize(5),
  },
  subTotalText: {
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
    color: Colors.headerText,
  },
  subTotalPrice: {
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
    color: Colors.Background,
  },
  TotalPrice: {
    fontFamily: Regular,
    fontSize: Size.FindSize(24),
    color: Colors.Background,
  },
  checkOutView: {
    marginHorizontal: Size.FindSize(15),
    height: Size.FindSize(50),
    borderWidth: Size.FindSize(1),
    marginBottom: Size.FindSize(10),
    marginTop: Size.FindSize(15),
    borderColor: Colors.Background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Size.FindSize(10),
  },
  checkOutText: {
    color: Colors.Background,
    fontSize: Size.FindSize(18),
    fontFamily: Regular,
  },
  addressList: {
    marginTop: Size.FindSize(20),
    // paddingHorizontal: Size.FindSize(15),
  },
  addressameText: {
    fontSize: Size.FindSize(16),
    fontFamily: SemiBold,
    color: Colors.storeColor,
    width: "80%",
  },
  addressText1: {
    fontSize: Size.FindSize(12),
    fontFamily: Regular,
    color: Colors.pincodetext,
  },
  addressItemView: {
    paddingVertical: Size.FindSize(10),
    paddingHorizontal: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    borderWidth: Size.FindSize(1),
    marginEnd: Size.FindSize(15),
  },
  rowItem: {
    paddingHorizontal: Size.FindSize(10),
  },
});
