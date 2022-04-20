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
    marginTop: Size.FindSize(20),
  },
  nameView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfView: {
    width: Size.width / 2 - 20,
  },
  text: {
    color: Colors.text,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
    marginTop: Size.FindSize(30),
  },
  button: {
    backgroundColor: Colors.Background,
    borderColor: Colors.Background,
    //width: Size.width / 2 - 20,
    flex: 1,
    marginVertical: Size.FindSize(30),
  },
  buttonText: {
    color: Colors.white,
  },
  radioText: {
    marginRight: Size.FindSize(10),
    color: Colors.text,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
  },
  uploadButton: {
    flexDirection: "row",
    marginHorizontal: Size.FindSize(10),
    alignSelf: "center",
    width: Size.FindSize(120),
    height: Size.FindSize(40),
    borderWidth: Size.FindSize(1),
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.borderColor,
    borderRadius: Size.FindSize(5),
  },
  uploadIcon: {},
  uploadText: {
    color: Colors.uploadText,
    fontSize: Size.FindSize(16),
    marginStart: Size.FindSize(10),
    fontFamily: Regular,
  },
  profileView: {
    flexDirection: "row",
    marginTop: Size.FindSize(10),
  },
  profileImage: {
    height: Size.FindSize(90),
    width: Size.FindSize(90),
    borderRadius: Size.FindSize(5),
  },
  profileImageView: {
    height: Size.FindSize(100),
    width: Size.FindSize(100),
    borderWidth: Size.FindSize(2),
    borderColor: Colors.borderColor,
    borderRadius: Size.FindSize(5),
    padding: Size.FindSize(10),
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    height: Size.FindSize(50),
    backgroundColor: Colors.white,
    paddingHorizontal: Size.FindSize(15),
    borderColor: Colors.borderColor,
    borderWidth: Size.FindSize(1),
    marginTop: Size.FindSize(8),
  },
  dateText: {
    color: Colors.black,
    fontFamily: Regular,
  },
  dateIcon: {
    alignSelf: "center",
    position: "absolute",
    right: Size.FindSize(15),
  },
  dropdown: {
    height: Size.FindSize(50),
    backgroundColor: Colors.white,
    paddingHorizontal: Size.FindSize(15),
    borderColor: Colors.borderColor,
    borderWidth: Size.FindSize(1),
    marginTop: Size.FindSize(8),
  },
  selectedTextStyle: {
    color: Colors.text,
    fontSize: Size.FindSize(14),
    fontFamily: Regular,
  },
  headerText2: {
    fontFamily: Bold,
    color: Colors.headerText,
    fontSize: Size.FindSize(14),
    paddingHorizontal: Size.FindSize(30),
    marginBottom: Size.FindSize(20),
    textAlign: "center",
  },
  loginText2: {
    fontFamily: Regular,
    color: Colors.headerText,
    fontSize: Size.FindSize(14),
    paddingHorizontal: Size.FindSize(30),
    marginBottom: Size.FindSize(20),
    marginTop: Size.FindSize(10),
    textAlign: "center",
  },
  loginView: {
    flexDirection: "row",
    marginHorizontal: Size.FindSize(15),
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: Size.FindSize(2),
    padding: Size.FindSize(10),
    marginTop: Size.FindSize(20),
    borderColor: Colors.Background,
  },
  loginText: {
    fontFamily: Regular,
    color: Colors.Background,
    fontSize: Size.FindSize(16),
    paddingHorizontal: Size.FindSize(30),
  },
});