import { StyleSheet } from "react-native";
import { SemiBold, Bold, Regular } from "../../../Assets/fonts";
import Colors from "../../../Utility/Colors";
import { Size } from "../../../Utility/sizes";

// define your styles
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageView: {
    margin: Size.FindSize(13),
    borderWidth: Size.FindSize(1),
    height: Size.FindSize(250),
    justifyContent: "center",
    borderColor: Colors.cookBorder,
  },
  image: {
    height: Size.FindSize(200),
    width: "100%",
    margin: Size.FindSize(28),
  },
  slideImageView: {
    marginTop: Size.FindSize(5),
    marginRight: Size.FindSize(13),
    borderWidth: Size.FindSize(1),
    height: Size.FindSize(65),
    width: Size.FindSize(65),
    justifyContent: "center",
    alignItems: "center",
  },
  slideImage: {
    height: Size.FindSize(45),
    width: Size.FindSize(45),
  },
  leftSliderIcon: {
    height: Size.FindSize(22),
    width: Size.FindSize(22),
  },
  leftSlider: {
    position: "absolute",
    top: Size.FindSize(28),
  },
  rightSliderIcon: {
    height: Size.FindSize(22),
    width: Size.FindSize(22),
  },
  rightSlider: {
    position: "absolute",
    right: 0,
    top: Size.FindSize(28),
  },
  title: {
    color: Colors.Background,
    fontSize: Size.FindSize(28),
    fontFamily: Bold,
    marginTop: Size.FindSize(31),
  },
  brand: {
    color: Colors.button,
    fontSize: Size.FindSize(18),
    fontFamily: Regular,
    marginTop: Size.FindSize(3),
  },
  priceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Size.FindSize(10),
  },
  price: {
    color: Colors.Background,
    fontSize: Size.FindSize(41),
    fontFamily: Regular,
  },
  totalprice: {
    marginLeft: Size.FindSize(10),
    textDecorationLine: "line-through",
    color: Colors.forgotText,
    fontSize: Size.FindSize(25),
    fontFamily: Regular,
  },
  horizontalView: {
    flexDirection: "row",
  },
  flagText: {
    color: Colors.button,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    marginTop: Size.FindSize(5),
  },
  circleFlag: {
    height: Size.FindSize(58),
    width: Size.FindSize(58),
  },
  flagView: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Size.FindSize(25),
  },
  pointView: {
    flexDirection: "row",
    marginVertical: Size.FindSize(16),
    alignItems: "center",
  },
  pointIcon: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
    marginRight: Size.FindSize(9),
  },
  pointText: {
    color: Colors.yellow,
    fontSize: Size.FindSize(16),
    fontFamily: Regular,
  },
  buttonView: {
    flexDirection: "row",
    marginTop: Size.FindSize(30),
    marginBottom: Size.FindSize(20),
    flex: 1,
  },
  cartView: {
    borderWidth: 1,
    borderColor: Colors.Background,
    backgroundColor: Colors.Background,
    borderRadius: Size.FindSize(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(66),
    flex: 1,
  },
  outStockView: {
    borderWidth: 1,
    borderColor: Colors.Background,
    // backgroundColor: Colors.Background,
    borderRadius: Size.FindSize(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(66),
    flex: 1,
  },
  BuycartView: {
    borderWidth: 1,
    borderColor: Colors.headerline,
    borderRadius: Size.FindSize(5),
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(66),
    marginLeft: Size.FindSize(10),
    width: Size.FindSize(120),
  },
  buyText: {
    color: Colors.black,
    fontFamily: Regular,
    fontSize: Size.FindSize(20),
    alignSelf: "center",
  },
  cart: {
    height: Size.FindSize(30),
    width: Size.FindSize(30),
    tintColor: Colors.white,
  },
  add: {
    marginLeft: Size.FindSize(5),
    color: Colors.white,
    fontFamily: Regular,
    fontSize: Size.FindSize(20),
    alignSelf: "center",
  },
  favView: {
    height: Size.FindSize(66),
    width: Size.FindSize(66),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.Background,
    borderRadius: Size.FindSize(5),
    marginLeft: Size.FindSize(10),
  },
  fav: {
    height: Size.FindSize(30),
    width: Size.FindSize(30),
    tintColor: Colors.Background,
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Size.FindSize(5),
  },
  Description: {
    // color: Colors.storeColor,
    color: Colors.black,
    fontFamily: SemiBold,
    fontSize: Size.FindSize(24),
    marginTop: Size.FindSize(43),
    marginBottom: Size.FindSize(5),
  },
  line: {
    height: Size.FindSize(1),
    backgroundColor: Colors.line,
    marginBottom: Size.FindSize(10),
  },
  text: {
    // color: Colors.button,
    color: Colors.black,
    fontFamily: Regular,
    fontSize: Size.FindSize(12),
    marginBottom: Size.FindSize(76),
  },
  fbIcon: {
    height: Size.FindSize(15),
    width: Size.FindSize(15),
  },
  fbText: {
    color: Colors.white,
    fontFamily: SemiBold,
    fontSize: Size.FindSize(10),
    marginLeft: Size.FindSize(5),
  },
  fbButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Size.FindSize(5),
    flex: 1,
    height: Size.FindSize(32),
    marginHorizontal: Size.FindSize(2.5),
  },
  discountPrice: {
    color: "#388e3c",
    fontFamily: Regular,
    fontSize: Size.FindSize(18),
  },
  discountBox: {
    marginTop: Size.FindSize(15),
    height: Size.FindSize(60),
    borderColor: "#388e3c",
    borderWidth: Size.FindSize(1),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Size.FindSize(20),
  },
  flatDiscountText: {
    fontFamily: Bold,
    fontSize: Size.FindSize(14),
    marginLeft: Size.FindSize(15),
    color: Colors.black,
  },
  flatDiscountText1: {
    marginLeft: Size.FindSize(15),
    fontFamily: Regular,
    fontSize: Size.FindSize(12),
    color: Colors.forgotText,
  },

  countPanelView: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    height: Size.FindSize(66),
    flex: 1,
  },
  minusButton: {
    height: Size.FindSize(66),
    width: Size.FindSize(60),
    backgroundColor: Colors.cookBorder,
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(66),
    borderTopLeftRadius: Size.FindSize(5),
    borderBottomLeftRadius: Size.FindSize(5),
  },
  plusButton: {
    height: Size.FindSize(66),
    width: Size.FindSize(60),
    backgroundColor: Colors.Background,
    justifyContent: "center",
    alignItems: "center",
    height: Size.FindSize(66),
    borderTopRightRadius: Size.FindSize(5),
    borderBottomRightRadius: Size.FindSize(5),
  },
  minusText: {
    fontSize: Size.FindSize(28),
    lineHeight: Size.FindSize(66),
    color: Colors.headerText,
    fontFamily: Regular,
  },
  plusText: {
    fontSize: Size.FindSize(28),
    lineHeight: Size.FindSize(66),
    color: Colors.white,
    fontFamily: Regular,
  },
  countView: {
    height: Size.FindSize(66),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.cookBorder,
  },
  countText: {
    fontSize: Size.FindSize(28),
    lineHeight: Size.FindSize(66),
    color: Colors.Background,
    fontFamily: Regular,
    justifyContent: "center",
  },
});
