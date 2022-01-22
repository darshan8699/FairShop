import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import APICallService from "../API/APICallService";
import { Regular } from "../Assets/fonts";
import Loader2 from "../Components/Loader2";
import { Route } from "../Navigation/Routes";
import Colors from "../Utility/Colors";
import { CATEGORY_DROPDOWN, PREF_STORE_ID } from "../Utility/Constants";
import { showErrorMessage, validateResponse } from "../Utility/Helper";
import Logger from "../Utility/Logger";
import Navigator from "../Utility/Navigator";
import { Size } from "../Utility/sizes";
import Strings from "../Utility/Strings";

// create a component
const MyComponent = (props) => {
  const [listview, setlistview] = useState(false);
  const [isShowLoader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    APICall();
    getSelectedStore();
  }, []);

  async function getSelectedStore() {
    const store_id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    Logger.log({ store_id });
    if (store_id == null) {
      Navigator.navigate(Route.StoreLocator);
    }
  }

  const APICall = () => {
    setLoader(true);
    const apiClass = new APICallService(CATEGORY_DROPDOWN);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        Navigator.navigate(Route.ShopCategoryWise, { categoryDetail: item });
      }}
    >
      <Text style={[styles.textView, { marginLeft: Size.FindSize(20) }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Loader2 modalVisible={isShowLoader} />
      <View style={styles.header}>
        <Text style={[styles.textToggleView, { color: Colors.text }]}>
          {Strings.Menu}
        </Text>
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
            { backgroundColor: listview ? Colors.pinkBack : Colors.white },
          ]}
        >
          <Text
            style={[
              styles.textToggleView,
              { color: listview ? Colors.Background : Colors.forgotText },
            ]}
          >
            {Strings.ShopbyCategories}
          </Text>
          <TouchableOpacity onPress={() => setlistview(!listview)}>
            <MaterialIcons
              name={listview ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              color={listview ? Colors.Background : Colors.forgotText}
              size={20}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {listview ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={{ height: Size.FindSize(250) }}
            bounces={false}
          />
        ) : null}
        <TouchableOpacity onPress={() => Navigator.navigate(Route.Recipes)}>
          <Text style={styles.textView}>{Strings.Recipes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.Offers)}>
          <Text style={styles.textView}>{Strings.Offers}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Navigator.navigate(Route.StoreLocator)}
        >
          <Text style={styles.textView}>{Strings.StoreLocator}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.AboutUs)}>
          <Text style={styles.textView}>{Strings.AboutUs}</Text>
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
    padding: 0.5,
    backgroundColor: Colors.headerline,
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
    fontFamily: Regular,
  },
  textToggleView: {
    fontFamily: Regular,
    color: Colors.forgotText,
  },
});

//make this component available to the app
export default MyComponent;
