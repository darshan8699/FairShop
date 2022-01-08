//import liraries
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Route } from "../Navigation/Routes";
import Colors from "../Utility/Colors";
import Navigator from "../Utility/Navigator";

// create a component
const MyComponent = (props) => {
  const [listview, setlistview] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Menu</Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
          }}
        >
          <MaterialCommunityIcons name={"close"} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.lineView} />
      <View style={styles.body}>
        <TouchableOpacity
          onPress={() => setlistview(!listview)}
          style={[
            styles.categoryButton,
            { backgroundColor: listview ? "#fdecef" : Colors.white },
          ]}
        >
          <Text
            style={[
              styles.textToggleView,
              { color: listview ? Colors.Background : Colors.forgotText },
            ]}
          >
            Shop by Categories
          </Text>
          <TouchableOpacity onPress={() => setlistview(!listview)}>
            <MaterialIcons
              name={listview ? "keyboard-arrow-down" : "keyboard-arrow-up"}
              size={20}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.Recipes)}>
          <Text style={styles.textView}>Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.Offers)}>
          <Text style={styles.textView}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Navigator.navigate(Route.StoreLocator)}
        >
          <Text style={styles.textView}>Store Locator</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.AboutUs)}>
          <Text style={styles.textView}>About Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    justifyContent: "space-between",
    padding: 20,
    flexDirection: "row",
  },
  lineView: {
    padding: 0.3,
    backgroundColor: "grey",
  },
  body: {
    padding: 20,
  },
  categoryButton: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
  },
  textView: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: Colors.forgotText,
  },
  textToggleView: {},
});

//make this component available to the app
export default MyComponent;
