import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {Platform} from 'react-native';
import * as screen from '../Screens';
import {Route} from './Routes';
import CustomDrawerNavigator from './CustomDrawerNavigator';
import CustomBottomNavigator from './CustomBottomNavigator';
const horizontalAnimation = {
  gestureDirection: 'horizontal',
  headerShown: false,
  cardStyleInterpolator: ({current, layouts}) => {
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
  cardStyleInterpolator: ({current, layouts}) => {
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
      // tabBar={props => <CustomBottomNavigator {...props} />}
    >
      <Tab.Screen
        name={Route.UserHome}
        component={screen.UserHome}
        // options={{
        //   tabBarIcon: ({focused, color, size}) => (
        //     <Image
        //       style={{
        //         height: 27,
        //         width: 22,
        //         tintColor: focused ? Colors.primary : Colors.tabInActive,
        //       }}
        //       resizeMode="contain"
        //       source={Images.tab1_unselect}
        //     />
        //   ),
        // }}
      />
      <Tab.Screen
        name={Route.UserSearch}
        component={screen.UserSearch}
        // options={{
        //   tabBarIcon: ({focused, color, size}) => (
        //     <Image
        //       style={{
        //         height: 27,
        //         width: 34,
        //         tintColor: focused ? Colors.primary : Colors.tabInActive,
        //       }}
        //       resizeMode="contain"
        //       source={Images.tab2_unselect}
        //     />
        //   ),
        // }}
      />
      <Tab.Screen
        name={Route.UserCart}
        component={screen.UserCart}
        // options={{
        //   tabBarIcon: ({focused, color, size}) => (
        //     <TouchableOpacity
        //       onPress={() =>
        //         Navigator.navigate(Route.CameraScreen, {type: TYPE_POST})
        //       }>
        //       <View
        //         style={{
        //           //marginTop: -Size.FindSize(30),
        //           marginBottom: Size.FindSize(15),
        //           height: 70,
        //           width: 70,
        //           borderRadius: 70 / 2,
        //           backgroundColor: Colors.white,
        //           alignItems: 'center',
        //           justifyContent: 'center',
        //           overflow: 'hidden',
        //         }}>
        //         <Image
        //           style={{
        //             backgroundColor: Colors.white,
        //             height: 65,
        //             borderRadius: 65 / 2,
        //             width: 65,
        //           }}
        //           resizeMode="contain"
        //           source={Images.tab3}
        //         />
        //       </View>
        //     </TouchableOpacity>
        //   ),
        // }}
      />
      <Tab.Screen
        name={Route.UserProfile}
        component={screen.UserProfile}
        // options={{
        //   tabBarIcon: ({focused, color, size}) => (
        //     <Image
        //       style={{
        //         height: 25,
        //         width: 31,
        //         tintColor: focused ? Colors.primary : Colors.tabInActive,
        //       }}
        //       resizeMode="contain"
        //       source={Images.tab4_unselect}
        //     />
        //   ),
        // }}
      />
    </Tab.Navigator>
  );
}
function DrawerApp() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#c6cbef',
          width: '100%',
        },
      }}
      drawerContent={props => <CustomDrawerNavigator {...props} />}>
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
        headerMode="none"
        screenOptions={
          Platform.OS == 'ios' ? iOSAnimation : horizontalAnimation
        }>
        <Stack.Screen name={Route.Splash} component={screen.Splash} />
        <Stack.Screen name={Route.Login} component={screen.Login} />
        <Stack.Screen name={Route.SignUp} component={screen.SignUp} />
        <Stack.Screen name={Route.DrawerApp} component={DrawerApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default RootNavigation;
