//import liraries
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import MainRouteConfig from "./src/Navigation/RootNavigation";
import Colors from "./src/Utility/Colors";
// export const store = createStore(mainReducer, applyMiddleware(ReduxThunk));

// create a component
const MyComponent = () => {
  return (
    <RootSiblingParent>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.Background }} />
        <StatusBar backgroundColor={Colors.Background} />
        <SafeAreaView style={styles.container}>
          <MainRouteConfig />
        </SafeAreaView>
      </View>
    </RootSiblingParent>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});

//make this component available to the app
export default MyComponent;
