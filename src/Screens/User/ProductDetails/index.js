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
  ImageBackground,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import {
  ADD_TO_CART,
  ADD_WISHLIST,
  ALL_CART,
  ALL_WISHLIST,
  NO_IMAGE_URL,
  PREF_LOGIN_INFO,
  PRODUCT_DETAILS,
  UPDATE_CART_COUNT,
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
import CountryFlag from "react-native-country-flag";
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
  const [favarray, setFavarray] = useState([]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      GetItemData();
      setLoginInfo();
      AsyncStorageLib.getItem(ALL_WISHLIST, (err, result) => {
        if (result) setFavarray(JSON.parse(result));
      });
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
      .then(function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          console.log("res:-----", res.data);
          setProductData(res.data.item);
          setImageArr(res.data.item.images);
          if (res.data.item.images) {
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

  const addToCart = (product) => {
    AsyncStorageLib.getItem(ALL_CART, (err, result) => {
      product.quantity = 1;
      const cartList = [product];
      var prefList = [];
      if (result && JSON.parse(result).length > 0) {
        const saveList = JSON.parse(result);
        prefList = [...saveList, ...cartList];
      } else {
        prefList = [...cartList];
      }
      AsyncStorageLib.setItem(ALL_CART, JSON.stringify(prefList));
      let productList = [];
      for (const key in prefList) {
        if (prefList.hasOwnProperty(key)) {
          const element = prefList[key];
          productList.push({
            product_item_code: element.item_code,
            quantity: element.quantity,
          });
        }
      }
      APICallAddToCart(productList);
    });
  };

  const APICallAddToCart = (product_list) => {
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      product: product_list,
      order_using: "Web_store",
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          showSuccessMessage("item added in cart");
          EventRegister.emit(UPDATE_CART_COUNT, product_list.length);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const addToWishList = (product_item_code) => {
    AsyncStorageLib.getItem(ALL_WISHLIST, (err, result) => {
      const id = [product_item_code];
      if (result !== null && result != product_item_code) {
        if (JSON.parse(result).includes(product_item_code) == false) {
          var newIds = JSON.parse(result).concat(id);
          AsyncStorageLib.setItem(ALL_WISHLIST, JSON.stringify(newIds));
          setLoader(true);
          const apiClass = new APICallService(ADD_WISHLIST, {
            product_item_code: newIds,
          });
          apiClass
            .callAPI()
            .then(async function (res) {
              setLoader(false);
              if (validateResponse(res)) {
                showSuccessMessage(res.message);
                setFavarray(JSON.stringify(newIds));
              }
            })
            .catch((err) => {
              setLoader(false);
              showErrorMessage(err.message);
            });
        } else {
          try {
            let favItemArray = JSON.parse(result);
            alteredItems = favItemArray.filter(function (e) {
              return e !== product_item_code;
            });
            AsyncStorageLib.setItem(ALL_WISHLIST, JSON.stringify(alteredItems));
            const apiClass = new APICallService(ADD_WISHLIST, {
              product_item_code: alteredItems,
            });
            apiClass
              .callAPI()
              .then(async function (res) {
                if (validateResponse(res)) {
                  showSuccessMessage(res.message);
                  setFavarray(JSON.stringify(alteredItems));
                }
              })
              .catch((err) => {
                showErrorMessage(err.message);
              });
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AsyncStorageLib.setItem(ALL_WISHLIST, JSON.stringify(id));
        setLoader(true);
        const apiClass = new APICallService(ADD_WISHLIST, {
          product_item_code: id,
        });
        apiClass
          .callAPI()
          .then(async function (res) {
            setLoader(false);
            if (validateResponse(res)) {
              showSuccessMessage(res.message);
              setFavarray(JSON.stringify(id));
            }
          })
          .catch((err) => {
            setLoader(false);
            showErrorMessage(err.message);
          });
      }
    });
  };
  function percentage(partialValue, totalValue) {
    return Math.round(100 - (100 * partialValue) / totalValue);
  }

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isRightIcon={false} isBack /> */}
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
        {productData.brand && (
          <Text style={styles.brand}>Brand : {productData.brand}</Text>
        )}
        <View style={styles.priceView}>
          {productData.offer ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.price}>
                ₹{productData.mrp - productData.offer.discount}
              </Text>
              <Text style={styles.totalprice}>₹{productData.mrp}</Text>
            </View>
          ) : (
            <Text style={styles.price}>₹{productData.mrp}</Text>
          )}
          <View style={styles.horizontalView}>
            {productData.veg_non_veg && (
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
                    ? Strings.VEG
                    : Strings.NON_VEG}
                </Text>
              </View>
            )}
            {productData.country_of_origin && (
              <View style={styles.flagView}>
                {/* <Image
                  source={Images.circleFlag}
                  style={styles.circleFlag}
                  resizeMode={"contain"}
                /> */}
                <ImageBackground
                  source={Images.flagCircle}
                  style={{
                    height: Size.FindSize(58),
                    width: Size.FindSize(58),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CountryFlag
                    isoCode={productData.country_of_origin}
                    size={18}
                  />
                </ImageBackground>
                <Text style={styles.flagText}>
                  Origin : {productData.country_of_origin}
                </Text>
              </View>
            )}
          </View>
        </View>
        {productData.offer && (
          <View>
            <Text style={styles.discountPrice}>
              You save ₹{productData.offer.discount}
            </Text>
            <View style={styles.discountBox}>
              <Text style={styles.discountPrice}>%</Text>
              <View>
                <Text style={styles.flatDiscountText}>
                  {"Flat " + productData.offer.discount + " off"}
                </Text>
                <Text style={styles.flatDiscountText1}>
                  {"Flat " + productData.offer.discount + " off"}
                </Text>
              </View>
            </View>
          </View>
        )}
        {/* <View style={styles.pointView}>
          <Image
            source={Images.Point}
            style={styles.pointIcon}
            resizeMode={"contain"}
          />
          <Text style={styles.pointText}>
            {"Collect 100 points with this purchase"}
          </Text>
        </View> */}
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.cartView}
            onPress={() => addToCart(productData, 1)}
          >
            <Image
              source={Images.cart}
              resizeMode="contain"
              style={styles.cart}
            />
            <Text style={styles.add}>{Strings.AddToCart}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BuycartView} onPress={() => {}}>
            <Text style={styles.buyText}>{Strings.BuyNow}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favView}
            onPress={() => {
              addToWishList(productData.item_code);
            }}
          >
            {favarray.indexOf(productData.item_code) !== -1 ? (
              <Image
                source={Images.heart}
                resizeMode="contain"
                style={styles.fav}
              />
            ) : (
              <Image
                source={Images.fav}
                resizeMode="contain"
                style={styles.fav}
              />
            )}
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
            <Text style={styles.fbText}>{Strings.Facebook}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fbButton, { backgroundColor: Colors.tweet }]}
          >
            <Image
              style={styles.fbIcon}
              source={Images.tweet}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Twitter}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fbButton, { backgroundColor: Colors.wt }]}
          >
            <Image
              style={styles.fbIcon}
              source={Images.wt}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.WhatsApp}</Text>
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
        <View>
          <Text style={styles.Description}>{Strings.Disclaimer}</Text>
          <View style={styles.line} />
          <Text style={styles.text}>{Strings.disclaimerSentence}</Text>
        </View>
        {/* {productData.description && (
          <View>
            <Text style={styles.Description}>
              {productData.description ? Strings.Description : ""}
            </Text>
            <View style={styles.line} />
            <Text style={styles.text}>{productData.description}</Text>
          </View>
        )} */}
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
