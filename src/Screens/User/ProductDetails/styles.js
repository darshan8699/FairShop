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
    height: Size.FindSize(366),
    justifyContent: "center",
    borderColor: Colors.cookBorder,
  },
  image: {
    height: Size.FindSize(309),
    margin: Size.FindSize(28),
  },
  slideImageView: {
    marginTop: Size.FindSize(5),
    marginRight: Size.FindSize(13),
    borderWidth: Size.FindSize(1),
    height: Size.FindSize(85),
    width: Size.FindSize(85),
    justifyContent: "center",
    alignItems: "center",
  },
  slideImage: {
    height: Size.FindSize(65),
    width: Size.FindSize(65),
  },
  leftSliderIcon: {
    height: Size.FindSize(22),
    width: Size.FindSize(22),
  },
  leftSlider: {
    position: "absolute",
    top: Size.FindSize(38),
  },
  rightSliderIcon: {
    height: Size.FindSize(22),
    width: Size.FindSize(22),
  },
  rightSlider: {
    position: "absolute",
    right: 0,
    top: Size.FindSize(38),
  },
  title: {
    color: Colors.Background,
    fontSize: Size.FindSize(36),
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
    marginVertical: Size.FindSize(25),
    color: Colors.Background,
    fontSize: Size.FindSize(41),
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
  cart: {
    height: Size.FindSize(30),
    width: Size.FindSize(30),
    tintColor: Colors.white,
  },
  add: {
    marginLeft: Size.FindSize(5),
    color: Colors.white,
    fontFamily: Regular,
    fontSize: Size.FindSize(24),
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
    color: Colors.storeColor,
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
    color: Colors.button,
    fontFamily: Regular,
    fontSize: Size.FindSize(12),
    marginBottom: Size.FindSize(76),
  },
  fbIcon: {
    height: Size.FindSize(20),
    width: Size.FindSize(20),
  },
  fbText: {
    color: Colors.white,
    fontFamily: Regular,
    fontSize: Size.FindSize(12),
    marginLeft: Size.FindSize(5),
  },
  fbButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Size.FindSize(5),
    flex: 1,
    height: Size.FindSize(30),
    marginHorizontal: Size.FindSize(2.5),
  },
});
