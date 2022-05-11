//import liraries
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { createStoreHook, Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import MainRouteConfig from "./src/Navigation/RootNavigation";
import rootReducer, { configureStore } from "./src/ReduxStore/configureStore";
import Colors from "./src/Utility/Colors";

export const store = createStoreHook(rootReducer, applyMiddleware(thunk));

// create a component
const MyComponent = () => {
  return (
    <Provider store={store}>
      {/* <RootSiblingParent> */}
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.Background }} />
        <StatusBar backgroundColor={Colors.Background} />
        <SafeAreaView style={styles.container}>
          <MainRouteConfig />
        </SafeAreaView>
      </View>
      {/* </RootSiblingParent> */}
    </Provider>
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
