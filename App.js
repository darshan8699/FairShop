//import liraries
import React, { Fragment, useEffect, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import MainRouteConfig from "./src/Navigation/RootNavigation";
import { Route } from "./src/Navigation/Routes";
import Logger from "./src/Utility/Logger";
import Navigator from "./src/Utility/Navigator";
import Colors from "./src/Utility/Colors";

// export const store = createStore(mainReducer, applyMiddleware(ReduxThunk));

// create a component
const MyComponent = () => {
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      //componentDidMount
    } else {
      //componentWillReceiveProps
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MainRouteConfig />
    </SafeAreaView>
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
