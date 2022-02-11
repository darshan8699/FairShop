import { StyleSheet } from "react-native";
import Colors from "../../../Utility/Colors";
import { Size } from "../../../Utility/sizes";
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
    //paddingHorizontal: Size.FindSize(15),
  },
  back: {
    height: Size.FindSize(100),
    marginTop: Size.FindSize(1),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: Size.FindSize(40),
    fontFamily: Bold,
    color: Colors.white,
  },
  mainView: {
    paddingHorizontal: Size.FindSize(30),
    marginTop: Size.FindSize(20),
    marginBottom: Size.FindSize(20),
  },
  memberView: {
    borderWidth: Size.FindSize(0.5),
    borderColor: Colors.headerline,
    padding: Size.FindSize(10),
  },
  memberText: {
    fontSize: Size.FindSize(16),
    fontFamily: Bold,
    color: Colors.headerText,
  },
  pointView: {
    borderWidth: Size.FindSize(0.5),
    borderColor: Colors.headerline,
    padding: Size.FindSize(10),
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Size.FindSize(10),
  },
  goldView: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressView: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Size.FindSize(10),
    paddingBottom: Size.FindSize(30),
  },
  percetageText: {
    paddingLeft: Size.FindSize(10),
    fontSize: Size.FindSize(16),
    fontFamily: Regular,
    color: Colors.headerText,
  },
  tierText: {
    fontSize: Size.FindSize(12),
    fontFamily: Regular,
    color: Colors.headerText,
  },
  goldButton: {
    height: Size.FindSize(25),
    width: Size.FindSize(50),
    borderWidth: Size.FindSize(1),
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.goldBack,
    marginRight: Size.FindSize(10),
  },
  goldText: {
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    color: Colors.goldText,
  },
  balanceText: {
    marginVertical: Size.FindSize(20),
    fontSize: Size.FindSize(24),
    fontFamily: Bold,
    color: Colors.balanceText,
  },
  secondView: {
    borderWidth: Size.FindSize(0.5),
    borderColor: Colors.headerline,
    padding: Size.FindSize(10),
    flexDirection: "row",
  },
  countText: {
    paddingVertical: Size.FindSize(10),
    fontSize: Size.FindSize(22),
    fontFamily: Regular,
    color: Colors.text,
  },
  currencyText: {
    fontSize: Size.FindSize(16),
    fontFamily: Regular,
    color: Colors.currencyText,
  },
});
