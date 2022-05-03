import { StyleSheet } from "react-native";
import { Size } from "../../../Utility/sizes";
import Colors from "../../../Utility/Colors";
import { Bold, Medium, Regular, SemiBold } from "../../../Assets/fonts";

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
  list: {
    marginHorizontal: Size.FindSize(5),
  },
  listView: {},
  browseCard: {
    marginLeft: Size.FindSize(15),
    // borderRadius: Size.FindSize(10),
    marginBottom: Size.FindSize(10),
    marginTop: Size.FindSize(5),
    borderRadius: Size.FindSize(10),
    shadowColor: "#000",
    shadowOffset: { width: Platform.OS == "ios" ? 0 : 1, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.5 : 0.1,
    shadowRadius: Platform.OS == "ios" ? 2 : 1,
    elevation: 2,
    width: Size.width / 2 - Size.FindSize(25),
    flex: 1,
  },

  browseCardView: {
    borderRadius: Size.FindSize(10),
    overflow: "hidden",
    paddingBottom: Size.FindSize(10),
    paddingHorizontal: Size.FindSize(10),
    backgroundColor: Colors.white,
    flex: 1,
  },

  browseCategoryText: {
    color: Colors.headerText,
    fontFamily: Medium,
    fontSize: Size.FindSize(14),
    textAlign: "center",
    // width: Size.FindSize(143),
    marginTop: Size.FindSize(5),
  },
  browseImage: {
    height: Size.FindSize(147),
    width: Size.FindSize(135),
    marginTop: Size.FindSize(10),
    alignSelf: "center",
    overflow: "hidden",
  },
});
