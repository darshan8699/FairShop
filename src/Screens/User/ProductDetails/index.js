import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import {
  ADD_TO_CART,
  PREF_LOGIN_INFO,
  PRODUCT_DETAILS,
  ADD_WISHLIST,
} from "../../../Utility/Constants";
import {
  showErrorMessage,
  showSuccessMessage,
  validateResponse,
} from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const MyComponent = (props) => {
  const [currentindex, setcurrentindex] = useState(0);
  const [currentImage, setcurrentImage] = useState("");
  const [isShowLoader, setLoader] = useState(false);
  const [productData, setProductData] = useState("");
  const [loginData, setLoginData] = useState("");
  const [imageArr, setImageArr] = useState([]);
  const flatListRef = useRef();
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetItemData();
      setLoginInfo();
    }
  });
  async function setLoginInfo() {
    const jsonValue = await AsyncStorageLib.getItem(PREF_LOGIN_INFO);
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setLoginData(loginInfo?.item);
    }
  }
  const GetItemData = () => {
    setLoader(true);
    const apiClass = new APICallService(PRODUCT_DETAILS, props.route.params.id);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setProductData(res.data.item);
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
        source={{ uri: item.url ? item.url : NO_IMAGE_URL }}
        resizeMode="contain"
        style={styles.slideImage}
      />
    </TouchableOpacity>
  );

  const addToCart = (product_item_code, quantity) => {
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      product: [{ product_item_code: product_item_code, quantity: quantity }],
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const addToWishList = (product_item_code) => {
    Logger.log("product_item_code", product_item_code);
    setLoader(true);
    const apiClass = new APICallService(ADD_WISHLIST, {
      product_item_code: [product_item_code],
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage(res.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

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
        {imageArr && imageArr.length > 0 && (
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
        )}
        <Text style={styles.title} ellipsizeMode={"tail"}>
          {productData.item_name}
        </Text>
        <Text style={styles.brand}>Brand : {productData.brand}</Text>
        <View style={styles.priceView}>
          <Text style={styles.price}>₹{productData.mrp}</Text>
          <View style={styles.horizontalView}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={
                  productData.veg_non_veg == "Veg"
                    ? Images.circleVeg
                    : Images.circleNonVeg
                }
                style={styles.circleFlag}
                resizeMode={"contain"}
              />
              <Text style={styles.flagText}>
                {productData.veg_non_veg == "Veg"
                  ? "Pure Veg."
                  : "Pure NonVeg."}
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
          <TouchableOpacity
            style={styles.cartView}
            onPress={() => addToCart(productData.item_code, 1)}
          >
            <Image
              source={Images.cart}
              resizeMode="contain"
              style={styles.cart}
            />
            <Text style={styles.add}>{Strings.AddToCart}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favView}
            onPress={() => {
              addToWishList(productData.item_code);
            }}
          >
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

        <Text style={styles.Description}>
          {productData.description ? Strings.Description : ""}
        </Text>
        <View style={styles.line} />
        <Text style={styles.text}>{productData.description}</Text>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
