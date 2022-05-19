//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import NoDataView from "../../../Components/NoDataView";
import { Route } from "../../../Navigation/Routes";
import Colors from "../../../Utility/Colors";
import { DELETE_ADDRESS, MY_ADDRESS } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const AddressListing = (props) => {
  const [addressIndex, setaddressIndex] = useState(null);
  const [isShowLoader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetAddressData();
    }
    const unsubscribe = props.navigation.addListener("focus", () => {
      Logger.log("focus");
      GetAddressData();
    });
    return () => unsubscribe();
  });
  const deleteAddress = (id) => {
    setLoader(true);
    const apiClass = new APICallService(DELETE_ADDRESS, id);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("delete res", res.data);
          GetAddressData();
          setTimeout(() => {
            showSuccessMessage("" + res.message);
          }, 200);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const GetAddressData = () => {
    setLoader(true);
    const apiClass = new APICallService(MY_ADDRESS, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("data is:", res.data.items);
          setData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const renderAddressList = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.listView,
          {
            borderColor:
              addressIndex == index ? Colors.Background : Colors.button,
            backgroundColor:
              addressIndex == index ? Colors.pinkBack : Colors.white,
          },
        ]}
        onPress={() => setaddressIndex(index)}
      >
        <View style={styles.nameView}>
          <Text
            style={styles.addressameText}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                Navigator.navigate(Route.Address, { updateDetails: item.id })
              }
            >
              <Image
                source={Images.pencil}
                resizeMode={"contain"}
                style={styles.editIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(Strings.Delete_address_alert, null, [
                  {
                    text: Strings.Ok,
                    onPress: () => {
                      deleteAddress(item.id);
                    },
                  },
                  {
                    text: Strings.Cancel,
                    onPress: () => {},
                  },
                ]);
              }}
            >
              <Image
                source={Images.delete}
                resizeMode={"contain"}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoView}>
          <View style={styles.backView}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <View style={styles.userView}>
            <Image
              source={Images.profile}
              resizeMode={"contain"}
              style={styles.usericon}
            />
            <Text style={styles.text1}>{item.full_name}</Text>
          </View>
          <View style={styles.userView}>
            <Image
              source={Images.call}
              resizeMode={"contain"}
              style={styles.usericon}
            />
            <Text style={styles.text1}>{item.phone}</Text>
          </View>
        </View>
        <Text style={styles.text1}>{item.address_line_1}</Text>
        <Text style={styles.text1}>{item.address_line_2}</Text>
        <Text style={styles.text1}>{item.landmark}</Text>
        <Text style={styles.text1}>
          {item.city + ", " + item.state + "-" + item.pincode}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isBack isRightIcon={false} /> */}
      <Loader2 modalVisible={isShowLoader} />
      <View style={styles.headerView}>
        <Text style={styles.headerText}>{Strings.Addresses}</Text>
        <TouchableOpacity
          style={styles.addbuttonView}
          onPress={() =>
            Navigator.navigate(Route.Address, {
              onRefresh: () => {
                GetAddressData();
              },
            })
          }
        >
          <Text style={styles.addbuttontext}>{"+ " + Strings.Add}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderAddressList}
        style={styles.addressList}
      />
      <NoDataView
        isVisible={data.length == 0}
        title={Strings.No_data_found}
        containerStyle={{ height: Size.height / 2 }}
        isLoader={isShowLoader}
      />
    </View>
  );
};

//make this component available to the app
export default AddressListing;
