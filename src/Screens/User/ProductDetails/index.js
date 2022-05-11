import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { EventRegister } from "react-native-event-listeners";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { Route } from "../../../Navigation/Routes";
import Colors from "../../../Utility/Colors";
import {
  ADD_TO_CART,
  ADD_WISHLIST,
  ALL_CART,
  ALL_WISHLIST,
  GET_URL_PARAMS,
  NO_IMAGE_URL,
  PREF_LOGIN_INFO,
  PREF_STORE_ID,
  SHARE_URL,
  UPDATE_CART_COUNT,
} from "../../../Utility/Constants";
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
const MyComponent = (props) => {
  const [currentindex, setcurrentindex] = useState(0);
  const [currentImage, setcurrentImage] = useState("");
  const [isShowLoader, setLoader] = useState(false);
  const [productData, setProductData] = useState("");
  const [loginData, setLoginData] = useState("");
  const [imageArr, setImageArr] = useState([]);
  const [prefStoreId, setPrefStoreId] = useState("");
  const flatListRef = useRef();
  const isFirstRun = useRef(true);
  const [favarray, setFavarray] = useState([]);
  const [cartItem, setCartItem] = useState([]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setLoginInfo();
    }
    checkFilter();
  });

  async function checkFilter() {
    await AsyncStorageLib.getItem(ALL_WISHLIST, (err, result) => {
      if (result) setFavarray(JSON.parse(result));
    });

    await AsyncStorageLib.getItem(ALL_CART, (err, result) => {
      if (result) {
        const cartList = JSON.parse(result);
        setCartItem(
          cartList.filter(function (item) {
            return item.item_code == props.route.params.id;
          })
        );
      }
    });
  }

  async function setLoginInfo() {
    await setLoader(true);
    const id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setPrefStoreId(id);
    GetItemData(id);
    const jsonValue = await AsyncStorageLib.getItem(PREF_LOGIN_INFO);
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    Logger.log({ loginInfo });

    if (loginInfo) {
      setLoginData(loginInfo?.item);
    }
  }

  const GetItemData = async (id) => {
    setLoader(true);
    const apiClass = new APICallService(
      "/product" + "/" + props.route.params.id + " " + GET_URL_PARAMS,
      { store_id: id }
    );
    apiClass
      .callAPI()
      .then(function (res) {
        setLoader(false);
        if (validateResponse(res)) {
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

  const addToCart = async (product, isBuyNow) => {
    setLoader(true);
    await AsyncStorageLib.getItem(ALL_CART, (err, result) => {
      const saveList = JSON.parse(result);
      Logger.log({ saveList });
      if (saveList && saveList.length > 0) {
        for (const key in saveList) {
          if (saveList.hasOwnProperty(key)) {
            const element = saveList[key];
            if (element.item_code == product.item_code) {
              if (
                element.quantity < parseInt(product.inventory[0].stock_quantity)
              ) {
                APICallAddToCart(
                  {
                    product_item_code: element.item_code,
                    quantity: element.quantity + 1,
                  },
                  isBuyNow
                );
              } else {
                showErrorMessage("Stock limit over");
                setLoader(false);
              }
            } else {
              APICallAddToCart(
                {
                  product_item_code: product.item_code,
                  quantity: 1,
                },
                isBuyNow
              );
            }
          }
        }
      } else {
        APICallAddToCart(
          {
            product_item_code: product.item_code,
            quantity: 1,
          },
          isBuyNow
        );
      }
    });
  };

  const APICallAddToCart = (product_list, isBuyNow) => {
    const apiClass = new APICallService(ADD_TO_CART, {
      product: [product_list],
      order_using: "mobile",
      store_id: prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          EventRegister.emit(UPDATE_CART_COUNT, product_list.length);
          await AsyncStorageLib.getItem(ALL_CART, async (err, result) => {
            const cartList = JSON.parse(result);
            Logger.log({ cartList });
            let saveList = cartList && cartList.length > 0 ? [...cartList] : [];
            if (cartList && cartList.length > 0) {
              if (
                saveList.some(
                  (item) => res.data.values[0].item_code == item.item_code
                )
              ) {
                const index = saveList.findIndex(
                  (e) => e.item_code == res.data.values[0].item_code
                );
                saveList[index].quantity = res.data.values[0].quantity;
              } else {
                saveList.push(res.data.values[0]);
              }
            } else {
              saveList.push(res.data.values[0]);
            }

            const prefList = [...saveList];
            Logger.log({ prefList });
            await AsyncStorageLib.setItem(ALL_CART, JSON.stringify(prefList));
            EventRegister.emit(UPDATE_CART_COUNT, prefList.length);
            if (isBuyNow) {
              Navigator.navigate(Route.PaymentOrder);
            }
            setLoader(false);
          });
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
        setLoader(false);
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
            Logger.log(error);
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

  const updateCartData = async (product, quantity) => {
    setLoader(true);
    await AsyncStorageLib.getItem(ALL_CART, async (err, result) => {
      product.quantity = quantity;

      if (result && JSON.parse(result).length > 0) {
        let saveList = JSON.parse(result);
        for (const key in saveList) {
          if (saveList.hasOwnProperty(key)) {
            const element = saveList[key];
            if (element.item_code == product.item_code) {
              if (quantity <= parseInt(product.inventory[0].stock_quantity)) {
                saveList[key].quantity = quantity;
              } else {
                showErrorMessage("Stock limit over");
                setLoader(false);
              }
              //saveList[key].quantity = quantity;
            }
          }
        }
        saveList = saveList.filter(function (person) {
          return person.quantity != 0;
        });
        await AsyncStorageLib.setItem(ALL_CART, JSON.stringify(saveList));
        setLoader(false);
        // setCartList(saveList);
        // updateCartTotal(saveList);
        // let productList = [];
        // for (const key in saveList) {
        //   if (saveList.hasOwnProperty(key)) {
        //     const element = saveList[key];
        //     productList.push({
        //       product_item_code: element.item_code,
        //       quantity: element.quantity,
        //     });
        //   }
        // }
        // APICallUpdateToCart(productList);
      } else {
        setLoader(false);
      }
    });
  };

  const APICallUpdateToCart = (product_list) => {
    setLoader(true);
    const apiClass = new APICallService(ADD_TO_CART, {
      product: product_list,
      order_using: "mobile",
      store_id: prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          EventRegister.emit(UPDATE_CART_COUNT, product_list.length);
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
        setLoader(false);
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.price}>₹{productData.rsp}</Text>
            {productData.rsp < productData.mrp && (
              <Text style={styles.totalprice}>₹{productData.mrp}</Text>
            )}
          </View>

          <View style={styles.horizontalView}>
            {productData.veg_non_veg ? (
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
            ) : null}
            {productData.country_of_origin ? (
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
            ) : null}
          </View>
        </View>
        {productData.offer ? (
          <View>
            <Text style={styles.discountPrice}>
              {"You save ₹" + productData.offer.discount}
            </Text>
            <View style={styles.discountBox}>
              <Text style={styles.discountPrice}>%</Text>
              <View>
                <Text style={styles.flatDiscountText}>
                  {productData.offer.title}
                </Text>
                <Text style={styles.flatDiscountText1}>
                  {productData.offer.description}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
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
          {productData && productData.inventory.length > 0 ? (
            <View style={{ flexDirection: "row", flex: 1 }}>
              {cartItem.length > 0 ? (
                <View style={styles.countPanelView}>
                  <TouchableOpacity
                    style={styles.minusButton}
                    onPress={() =>
                      updateCartData(cartItem[0], cartItem[0].quantity - 1)
                    }
                  >
                    <Text style={styles.minusText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.countView} activeOpacity={1}>
                    <Text style={styles.countText}>{cartItem[0].quantity}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() =>
                      updateCartData(cartItem[0], cartItem[0].quantity + 1)
                    }
                  >
                    <Text style={styles.plusText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.cartView}
                  onPress={() => addToCart(productData, false)}
                >
                  <Image
                    source={Images.cart}
                    resizeMode="contain"
                    style={styles.cart}
                  />
                  <Text style={styles.add}>{Strings.AddToCart}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.BuycartView}
                onPress={() => {
                  addToCart(productData, true);
                }}
              >
                <Text style={styles.buyText}>{Strings.BuyNow}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={styles.outStockView}
              opacity={0.5}
              needsOffscreenAlphaCompositing
            >
              <Text style={[styles.add, { color: Colors.Background }]}>
                {Strings.OutOfStock}
              </Text>
            </View>
          )}
          {loginData ? (
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
          ) : null}
        </View>
        <View style={styles.socialButton}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.fbButton, { backgroundColor: "#3351A3" }]}
            onPress={() => {
              Share.share({
                message: SHARE_URL + productData?.slug,
              });
            }}
          >
            <Image
              style={styles.fbIcon}
              source={Images.facebook}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Facebook}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.fbButton, { backgroundColor: Colors.tweet }]}
            onPress={() => {
              Share.share({
                message: SHARE_URL + productData?.slug,
              });
            }}
          >
            <Image
              style={styles.fbIcon}
              source={Images.tweet}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.Twitter}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.fbButton, { backgroundColor: Colors.wt }]}
            onPress={() => {
              Linking.openURL(
                "whatsapp://send?text=:" + SHARE_URL + productData?.slug
              );
            }}
          >
            <Image
              style={styles.fbIcon}
              source={Images.wt}
              resizeMode={"contain"}
            />
            <Text style={styles.fbText}>{Strings.WhatsApp}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.fbButton, { backgroundColor: Colors.mail }]}
            onPress={() => {
              Linking.openURL("mailto:?body=" + SHARE_URL + productData?.slug);
            }}
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
