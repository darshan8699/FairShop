import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Platform, Image } from "react-native";
import * as screen from "../Screens";
import { Route } from "./Routes";
import CustomDrawerNavigator from "./CustomDrawerNavigator";
import CustomBottomNavigator from "./CustomBottomNavigator";
import { Images } from "../Assets/images";
import Colors from "../Utility/Colors";
const horizontalAnimation = {
  gestureDirection: "horizontal",
  headerShown: false,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const iOSAnimation = {
  headerShown: false,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        opacity: 1,
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function BottomTabApp() {
  return (
    <Tab.Navigator
      initialRouteName={Route.Landing}
      screenOptions={{
        headerShown: false,
      }}
      // tabBar={props => <CustomBottomNavigator {...props} />}
    >
      <Tab.Screen
        name={Route.UserHome}
        component={screen.UserHome}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? Colors.Background : Colors.button,
              }}
              resizeMode="contain"
              source={Images.home}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Route.UserSearch}
        component={screen.UserSearch}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? Colors.Background : Colors.button,
              }}
              resizeMode="contain"
              source={Images.search}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Route.UserCart}
        component={screen.UserCart}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? Colors.Background : Colors.button,
              }}
              resizeMode="contain"
              source={Images.cart}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Route.UserProfile}
        component={screen.UserProfile}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? Colors.Background : Colors.button,
              }}
              resizeMode="contain"
              source={Images.profile}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function DrawerApp() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#c6cbef",
          width: "100%",
        },
      }}
      drawerContent={(props) => <CustomDrawerNavigator {...props} />}
    >
      <Drawer.Screen name={Route.BottomTabApp} component={BottomTabApp} />
      <Drawer.Screen
        name={Route.ShopCategoryWise}
        component={screen.ShopCategoryWise}
      />
      <Drawer.Screen name={Route.Recipes} component={screen.Recipes} />
      <Drawer.Screen name={Route.Offers} component={screen.Offers} />
      <Drawer.Screen
        name={Route.StoreLocator}
        component={screen.StoreLocator}
      />
      <Drawer.Screen name={Route.AboutUs} component={screen.AboutUs} />
    </Drawer.Navigator>
  );
}

function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={
          Platform.OS == "ios" ? iOSAnimation : horizontalAnimation
        }
      >
        <Stack.Screen name={Route.Splash} component={screen.Splash} />
        <Stack.Screen name={Route.Login} component={screen.Login} />
        <Stack.Screen name={Route.SignUp} component={screen.SignUp} />
        <Stack.Screen name={Route.DrawerApp} component={DrawerApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default RootNavigation;
