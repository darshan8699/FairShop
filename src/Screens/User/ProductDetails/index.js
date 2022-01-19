//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../../../Components/Header";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
import { Size } from "../../../Utility/sizes";
import { Images } from "../../../Assets/images";
import Colors from "../../../Utility/Colors";
import { PRODUCT_DETAILS } from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import APICallService from "../../../API/APICallService";
import Logger from "../../../Utility/Logger";
import Loader2 from "../../../Components/Loader2";

// create a component
const MyComponent = (props) => {
  const [currentindex, setcurrentindex] = useState(0);
  const [currentImage, setcurrentImage] = useState("");
  const [isShowLoader, setLoader] = useState(false);
  const [data, setData] = useState("");
  const [imageArr, setImageArr] = useState([]);
  const flatListRef = useRef();
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetItemData();
    }
  });
  const GetItemData = () => {
    setLoader(true);
    const apiClass = new APICallService(PRODUCT_DETAILS, props.route.params.id);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("response data:--", res.data);
          Logger.log("response Images data:--", res.data.item.images);
          setData(res.data.item);
          setImageArr(res.data.item.images);
          if (res.data.item.images) {
            console.log("inner");
            setcurrentImage(res.data.item.images[0].url);
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const renderImages = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.slideImageView,
        {
          borderColor:
            currentindex == index ? Colors.Background : Colors.cookBorder,
        },
      ]}
      onPress={() => {
        setcurrentindex(index);
        setcurrentImage(item.url);
      }}
    >
      <Image
        source={{
          uri: item.url,
        }}
        resizeMode="contain"
        style={styles.slideImage}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} isBack />
      <Loader2 modalVisible={isShowLoader} />
      <ScrollView
        style={{
          padding: Size.FindSize(15),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageView}>
          <Image
            source={
              currentImage
                ? {
                    uri: currentImage,
                  }
                : Images.placeholder
            }
            resizeMode="contain"
            style={[
              styles.image,
              { alignSelf: currentImage ? null : "center" },
            ]}
          />
        </View>
        <View>
          <FlatList
            ref={flatListRef}
            horizontal
            data={imageArr}
            contentContainerStyle={styles.list}
            renderItem={renderImages}
            style={{ marginHorizontal: 13 }}
            nestedScrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            style={styles.leftSlider}
            onPress={() => {
              if (currentindex != 0) {
                flatListRef?.current?.scrollToIndex({
                  index: currentindex - 1,
                });
              }
            }}
          >
            <Image
              source={Images.leftSlider}
              resizeMode={"contain"}
              style={styles.leftSliderIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightSlider}
            onPress={() => {
              if (currentindex != imageArr.length - 1) {
                flatListRef?.current?.scrollToIndex({
                  index: currentindex + 1,
                });
              }
            }}
          >
            <Image
              source={Images.rightSlider}
              resizeMode={"contain"}
              style={styles.rightSliderIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode={"tail"}>
          {data.item_name}
        </Text>
        <Text style={styles.brand}>Brand : {data.brand}</Text>
        <View style={styles.priceView}>
          <Text style={styles.price}>₹{data.mrp}</Text>
          <View style={styles.horizontalView}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={
                  data.veg_non_veg == "Veg"
                    ? Images.circleVeg
                    : Images.circleNonVeg
                }
                style={styles.circleFlag}
                resizeMode={"contain"}
              />
              <Text style={styles.flagText}>
                {data.veg_non_veg == "Veg" ? "Pure Veg." : "Pure NonVeg."}
              </Text>
            </View>
            <View style={styles.flagView}>
              <Image
                source={Images.circleFlag}
                style={styles.circleFlag}
                resizeMode={"contain"}
              />
              <Text style={styles.flagText}>Origin : {"India"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.pointView}>
          <Image
            source={Images.Point}
            style={styles.pointIcon}
            resizeMode={"contain"}
          />
          <Text style={styles.pointText}>
            {"Collect 100 points with this purchase"}
          </Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.cartView} onPress={() => {}}>
            <Image
              source={Images.cart}
              resizeMode="contain"
              style={styles.cart}
            />
            <Text style={styles.add}>{Strings.AddToCart}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favView} onPress={() => {}}>
            <Image
              source={Images.fav}
              resizeMode="contain"
              style={styles.fav}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.socialButton}>
          <TouchableOpacity
            style={[styles.fbButton, { backgroundColor: "#3351A3" }]}
          >
            <Image
              style={styles.fbIcon}
              source={Images.facebook}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Share}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fbButton, { backgroundColor: Colors.tweet }]}
          >
            <Image
              style={styles.fbIcon}
              source={Images.tweet}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Tweet}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fbButton, { backgroundColor: Colors.wt }]}
          >
            <Image
              style={styles.fbIcon}
              source={Images.wt}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Share}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fbButton, { backgroundColor: Colors.mail }]}
          >
            <Image
              style={[styles.fbIcon, { tintColor: Colors.white }]}
              source={Images.mail}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Email}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.Description}>{Strings.Description}</Text>
        <View style={styles.line} />
        <Text style={styles.text}>{data.description}</Text>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
