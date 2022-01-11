import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Regular, SemiBold, Medium } from "../../../Assets/fonts";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  back: {
    height: Size.FindSize(300),
  },
  bestView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Size.FindSize(15),
    alignItems: "center",
    paddingTop: Size.FindSize(30),
  },
  bestText: {
    color: Colors.white,
    fontFamily: SemiBold,
    fontSize: Size.FindSize(24),
  },
  rightIcon: {
    tintColor: Colors.white,
    height: Size.FindSize(20),
    width: Size.FindSize(20),
  },
  bestImage: {
    height: Size.FindSize(181),
    width: Size.FindSize(275),
    marginTop: Size.FindSize(10),
  },
  BrowseView: {
    height: Size.FindSize(315),
    marginBottom: Size.FindSize(30),
  },
  BrowseTextView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Size.FindSize(15),
    alignItems: "center",
    paddingTop: Size.FindSize(30),
    paddingBottom: Size.FindSize(15),
  },
  BrowseText: {
    color: Colors.headerText,
    fontFamily: SemiBold,
    fontSize: Size.FindSize(24),
  },
  browserightIcon: {
    tintColor: Colors.headerText,
    height: Size.FindSize(20),
    width: Size.FindSize(20),
  },
  browseImage: {
    height: Size.FindSize(147),
    width: Size.FindSize(143),
  },
  browseCard: {
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: Size.FindSize(15),
    borderRadius: Size.FindSize(10),
    marginBottom: Size.FindSize(20),
  },
  browseCategoryText: {
    color: Colors.headerText,
    fontFamily: Medium,
    fontSize: Size.FindSize(14),
    textAlign: "center",
    width: Size.FindSize(143),
    marginTop: Size.FindSize(5),
  },
  back1: {
    height: Size.FindSize(300),
  },
  back2: {
    height: Size.FindSize(800),
  },
  whyFairshopImage: {
    height: Size.FindSize(250),
    width: (Size.width - Size.FindSize(60)) / 2,
  },
  whyFairShopView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Size.FindSize(15),
    alignItems: "center",
  },
  fairshopView: {
    height: Size.FindSize(330),
  },
  Popularback: {
    height: Size.FindSize(400),
  },
  popularCatImage: {
    height: Size.FindSize(200),
    width: Size.width,
    marginBottom: Size.FindSize(15),
    paddingHorizontal: Size.FindSize(15),
    alignSelf: "center",
  },
  cookView: {
    height: Size.FindSize(400),
    marginBottom: Size.FindSize(30),
  },
  cookImage: {
    height: Size.FindSize(200),
    width: Size.FindSize(360),
    borderTopLeftRadius: Size.FindSize(10),
    borderTopRightRadius: Size.FindSize(10),
  },
  timeImage: {
    height: Size.FindSize(20),
    width: Size.FindSize(20),
  },
  cookList: {
    marginLeft: Size.FindSize(15),
    width: Size.FindSize(360),
    borderWidth: 1,
    borderColor: Colors.cookBorder,
    borderRadius: Size.FindSize(10),
  },
  cookTextView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Size.FindSize(15),
  },
  cookText: {
    color: Colors.Background,
    fontFamily: Regular,
    fontSize: Size.FindSize(16),
  },
  timeText: {
    color: Colors.timeText,
    fontFamily: Regular,
    fontSize: Size.FindSize(14),
    marginLeft: Size.FindSize(5),
  },
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
});
