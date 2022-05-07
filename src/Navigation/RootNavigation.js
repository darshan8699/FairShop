import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Image, Platform, Text, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { Bold } from "../Assets/fonts";
import { Images } from "../Assets/images";
import * as screen from "../Screens";
import Colors from "../Utility/Colors";
import { ALL_CART, UPDATE_CART_COUNT } from "../Utility/Constants";
import Logger from "../Utility/Logger";
import { Size } from "../Utility/sizes";
import CustomDrawerNavigator from "./CustomDrawerNavigator";
import { Route } from "./Routes";
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
  const [tabCount, setCount] = React.useState(0);

  React.useEffect(() => {
    AsyncStorageLib.getItem(ALL_CART, (err, result) => {
      if (result) {
        let list = JSON.parse(result);
        setCount(list.length);
      }
    });
    EventRegister.addEventListener(UPDATE_CART_COUNT, (count) => {
      Logger.log({ count });
      setCount(count);
    });
  }, []);
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
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: focused ? Colors.Background : Colors.button,
                  }}
                  resizeMode="contain"
                  source={Images.cart}
                />
                {tabCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      end: -15,
                      top: -3,
                      backgroundColor: Colors.Background,
                      borderRadius: Size.FindSize(10),
                      height: Size.FindSize(20),
                      width: Size.FindSize(20),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: Bold,
                        fontSize: Size.FindSize(12),
                      }}
                    >
                      {tabCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
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
        <Stack.Screen
          name={Route.ForgotPassword}
          component={screen.ForgotPassword}
        />
        <Stack.Screen
          name={Route.ResetPassword}
          component={screen.ResetPassword}
        />
        <Stack.Screen name={Route.DrawerApp} component={DrawerApp} />
        <Stack.Screen name={Route.MyOrders} component={screen.MyOrders} />
        <Stack.Screen name={Route.MyProfile} component={screen.MyProfile} />
        <Stack.Screen
          name={Route.ShopCategoryWise}
          component={screen.ShopCategoryWise}
        />
        <Stack.Screen name={Route.Recipes} component={screen.Recipes} />
        <Stack.Screen name={Route.Offers} component={screen.Offers} />
        <Stack.Screen
          name={Route.StoreLocator}
          component={screen.StoreLocator}
        />
        <Stack.Screen
          name={Route.StoreLocatorSideMenu}
          component={screen.StoreLocatorSideMenu}
        />
        <Stack.Screen name={Route.AboutUs} component={screen.AboutUs} />
        <Stack.Screen name={Route.Address} component={screen.Address} />
        <Stack.Screen
          name={Route.AddressListing}
          component={screen.AddressListing}
        />
        <Stack.Screen name={Route.Wishlist} component={screen.Wishlist} />
        <Stack.Screen
          name={Route.ProductDetails}
          component={screen.ProductDetails}
        />
        <Stack.Screen
          name={Route.PaymentOrder}
          component={screen.PaymentOrder}
        />
        <Stack.Screen
          name={Route.OrderDetails}
          component={screen.OrderDetails}
        />
        <Stack.Screen
          name={Route.LoyaltyRewards}
          component={screen.LoyaltyRewards}
        />
        <Stack.Screen
          name={Route.PopularProduct}
          component={screen.PopularProduct}
        />
        <Stack.Screen
          name={Route.AllBrowseCategory}
          component={screen.AllBrowseCategory}
        />
        <Stack.Screen name={Route.NewProducts} component={screen.NewProducts} />
        <Stack.Screen
          name={Route.OrderSuccess}
          component={screen.OrderSuccess}
        />
        <Stack.Screen name={Route.ContactUs} component={screen.ContactUs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default RootNavigation;
