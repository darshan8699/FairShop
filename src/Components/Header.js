//import liraries
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Images } from "../Assets/images";
import { Route } from "../Navigation/Routes";
import Colors from "../Utility/Colors";
import { Size } from "../Utility/sizes";

// create a component
const Header = (props) => {
  const {
    isBack = false,
    navigation,
    isRightIcon = true,
    isLocation = false,
    isBackVisible = true,
  } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoView}
        activeOpacity={1}
        onPress={() => navigation.navigate(Route.UserHome)}
      >
        <Image
          source={Images.headerLogo}
          resizeMode={"contain"}
          style={styles.logo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconView}
        onPress={() => {
          if (!isBackVisible) {
            return;
          }
          if (isBack) {
            navigation.goBack();
          } else {
            navigation.openDrawer();
          }
        }}
      >
        <Image
          source={isBack ? Images.back : Images.menu}
          resizeMode={"contain"}
          style={styles.icon}
        />
      </TouchableOpacity>
      {isRightIcon && (
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => {
            navigation.navigate(Route.StoreLocator);
          }}
        >
          <Image
            source={Images.location}
            resizeMode={"contain"}
            style={[
              styles.icon,
              { tintColor: isLocation ? Colors.Background : Colors.button },
            ]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Size.FindSize(60),
    marginBottom: Size.FindSize(10),
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: Size.FindSize(15),
    borderBottomColor: Colors.headerline,
    borderBottomWidth: Size.FindSize(0.5),
  },
  logoView: {
    height: Size.FindSize(70),
    top: 0,
    position: "absolute",
    left: Size.FindSize(-135),
  },
  logo: {
    height: Size.FindSize(70),
  },
  icon: {
    height: Size.FindSize(25),
    width: Size.FindSize(25),
    alignSelf: "center",
  },
  iconView: {
    alignSelf: "center",
  },
});

//make this component available to the app
export default Header;
