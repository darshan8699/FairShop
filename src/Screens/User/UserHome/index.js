//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import APICallService from "../../../API/APICallService";
import { Images } from "../../../Assets/images";
import CustomItemView from "../../../Components/CustomItemView";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import { Route } from "../../../Navigation/Routes";
import Colors from "../../../Utility/Colors";
import {
  ALL_WISHLIST,
  CATEGORY,
  HOMEPAGE_NEW_PRODUCT,
  HOMEPAGE_POPULAR_PRODUCT,
  HOME_BANNER,
  NO_IMAGE_URL,
  OFFERS,
  WHISHLIST,
  CATEGORY_DETAILS,
  PREF_STORE_ID,
  PREF_LOGIN_INFO,
  HOMEPAGE_TOP_PICK,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Navigator from "../../../Utility/Navigator";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";
// create a component
const MyComponent = (props) => {
  const [popularData, setPopularData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [category, setCategory] = useState([]);
  const [bestValueOffers, setBestValueOffers] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [popularCategory, setPopularCategory] = useState([]);
  const [whyFairshop, setWhyFairshop] = useState([]);
  const [isShowLoader, setLoader] = useState(false);
  const [topPickData, setTopPickData] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);
  const [prefStoreId, setPrefStoreId] = useState("");
  const [loginInfo, setLoginInfo] = useState("");

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallWishList();
      firstAPICall();
    }

    const _unsubscribe = props.navigation.addListener("focus", async () => {
      // do something
      const id = await AsyncStorage.getItem(PREF_STORE_ID);
      setPrefStoreId(id);
      if (id) {
        GetPopularProductData(id, false);
        GetNewProductData(id, false);
        GetBrowseCategory(id, false);
        GetTopPickData(id, false);
        APICallBanner(id, false);
        // APICallOffers(id);
      }
      getTopPickTitle();
    });
    return _unsubscribe;
  });

  async function firstAPICall() {
    const id = await AsyncStorage.getItem(PREF_STORE_ID);
    setPrefStoreId(id);
    if (id) {
      GetPopularProductData(id);
      GetNewProductData(id);
      GetBrowseCategory(id);
      GetTopPickData(id);
      APICallBanner(id);
      // APICallOffers(id);
    }

    getTopPickTitle();
    const jsonValue = await AsyncStorage.getItem("loginInfo");
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    setLoginInfo(loginInfo);
  }

  const getTopPickTitle = async () => {
    const jsonValue = await AsyncStorage.getItem(PREF_LOGIN_INFO);
    const loginInfo = jsonValue != null ? JSON.parse(jsonValue) : null;
    setLoginStatus(loginInfo);
  };
  const GetTopPickData = async (id, isLoader = true) => {
    setLoader(isLoader);
    const apiClass = new APICallService(HOMEPAGE_TOP_PICK, {
      store_id: id ? id : prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setTopPickData(res.data.items);
        } else {
          setTopPickData([]);
        }
      })
      .catch((err) => {
        setTopPickData([]);
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const GetPopularProductData = async (id, isLoader = true) => {
    setLoader(isLoader);
    const apiClass = new APICallService(HOMEPAGE_POPULAR_PRODUCT, {
      store_id: id ? id : prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setPopularData(res.data.items);
        } else {
          setPopularData([]);
        }
      })
      .catch((err) => {
        setPopularData([]);
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const GetNewProductData = async (id, isLoader = true) => {
    setLoader(isLoader);
    const apiClass = new APICallService(HOMEPAGE_NEW_PRODUCT, {
      store_id: id ? id : prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setNewData(res.data.items);
        } else {
          setNewData([]);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
        setNewData([]);
      });
  };
  const GetBrowseCategory = (id, isLoader = true) => {
    setLoader(isLoader);

    const apiClass = new APICallService(CATEGORY, {
      limit: -1,
      store_id: id ? id : prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          var tList = [];
          const temp = res.data.items;
          for (const key in temp) {
            if (temp.hasOwnProperty(key)) {
              const element = temp[key].children;
              for (const key in element) {
                const element2 = element[key];
                tList.push(element2);
              }
            }
          }
          setCategory(tList);
        } else {
          setCategory([]);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
        setCategory([]);
      });
  };

  const APICallBanner = (id, isLoader = true) => {
    setLoader(isLoader);
    const apiClass = new APICallService(HOME_BANNER, {
      store_id: id ? id : prefStoreId,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          const bannerImage = [];
          const whyShop = [];
          Logger.log(res.data?.item?.content);
          for (const key in res.data?.item?.content?.banner) {
            if (res.data?.item?.content?.banner.hasOwnProperty(key)) {
              const element = res.data?.item?.content?.banner[key];
              bannerImage.push(element?.mobile[0]?.url);
            }
          }
          for (const key in res.data?.item?.content?.why_fairshop) {
            if (res.data?.item?.content?.why_fairshop.hasOwnProperty(key)) {
              const element = res.data?.item?.content?.why_fairshop[key];
              whyShop.push(element[0].thumbnail);
            }
          }

          setBannerImages(bannerImage);
          setPopularCategory(res.data?.item?.content?.popular_category);
          setWhyFairshop(whyShop);
        } else {
          setBannerImages([]);
          setWhyFairshop([]);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallWishList = (isLoader = true) => {
    setLoader(isLoader);
    const apiClass = new APICallService(WHISHLIST, {
      // page: page,
      limit: -1,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          const wishListArr = res.data.items[0].products;
          let array = [];
          for (const key in wishListArr) {
            if (wishListArr.hasOwnProperty(key)) {
              const element = wishListArr[key];
              array.push(element.item_code);
            }
          }
          AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(array));
        }
      })
      .catch((err) => {
        setLoader(false);
        // showErrorMessage(err.message);
      });
  };

  const renderBestItem = ({ item, index }) => (
    <Image
      source={{ uri: item?.bannerImage }}
      style={styles.bestImage}
      key={index}
    />
  );
  const renderBrowseCategory = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={styles.browseCard}
      activeOpacity={1}
      onPress={() =>
        Navigator.navigate(Route.ShopCategoryWise, { categoryDetail: item })
      }
    >
      <View style={styles.browseCardView}>
        <Image
          source={{
            uri:
              item.icon && item.icon[0].url ? item.icon[0].url : NO_IMAGE_URL,
          }}
          style={styles.browseImage}
        />
        <Text
          style={styles.browseCategoryText}
          numberOfLines={2}
          ellipsizeMode={"tail"}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const clickOnPopularCategory = (item) => {
    setLoader(true);
    const apiClass = new APICallService(CATEGORY_DETAILS, item);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Navigator.navigate(Route.ShopCategoryWise, {
            categoryDetail: { slug: item, name: res.data.item.name },
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        // showErrorMessage(err.message);
      });
  };
  const renderPopularCategory = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => clickOnPopularCategory(item.id)}
    >
      <Image
        key={index}
        source={{ uri: item?.image[0]?.url }}
        style={styles.popularCatImage}
      />
    </TouchableOpacity>
  );

  const renderWhereShop = ({ item, index }) => (
    <Image
      key={index}
      source={{ uri: item }}
      style={[
        styles.WhyFairshopImage,
        { marginEnd: Size.FindSize(index == whyFairshop.length - 1 ? 15 : 0) },
      ]}
      resizeMode={"contain"}
    />
  );

  const renderCookItem = ({ item }) => (
    <TouchableOpacity style={styles.cookList}>
      <Image source={Images.videoTest} style={styles.cookImage} />
      <View style={styles.cookTextView}>
        <View>
          <Text style={styles.cookText}>{"Restaurant Style Bhajipau"}</Text>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={Images.time}
              resizeMode="contain"
              style={styles.timeImage}
            />
            <Text style={styles.timeText}>{"30 min"}</Text>
          </View>
        </View>
        <Image
          source={Images.veg}
          resizeMode="contain"
          style={styles.timeImage}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      <Loader2 modalVisible={isShowLoader} />
      <ScrollView
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={{ height: Size.FindSize(10) }} />
        <SliderBox
          images={bannerImages}
          resizeMode="contain"
          resizeMethod="auto"
          onCurrentImagePressed={(index) =>
            Logger.log(`image ${index} pressed`)
          }
          inactiveDotColor={Colors.white}
          sliderBoxHeight={140}
          dotColor={Colors.Background}
          currentImageEmitter={(index) =>
            Logger.log(`current pos is: ${index}`)
          }
        />
        {bestValueOffers.length > 0 ? (
          <ImageBackground source={Images.homeBG} style={styles.back}>
            <View style={styles.bestView}>
              <Text style={styles.bestText}>{Strings.Best_value}</Text>
              <TouchableOpacity>
                <Image
                  source={Images.rightArrow}
                  resizeMode="contain"
                  style={styles.rightIcon}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={bestValueOffers}
              horizontal={true}
              renderItem={renderBestItem}
              showsHorizontalScrollIndicator={false}
            />
          </ImageBackground>
        ) : null}
        {topPickData?.length > 0 ? (
          <View style={styles.BrowseView}>
            <View style={styles.BrowseTextView}>
              <Text style={styles.BrowseText}>
                {loginStatus ? Strings.TopPickYou : Strings.TopSellProduct}
              </Text>
            </View>
            <FlatList
              data={topPickData.slice(0, 8)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: Size.FindSize(15),
                paddingTop: Size.FindSize(5),
              }}
              numColumns={2}
              renderItem={({ item }) => (
                <CustomItemView
                  item={item}
                  listView={styles.shadow}
                  loginInfo={loginInfo ? true : false}
                  storeId={prefStoreId}
                />
              )}
            />
            {topPickData?.length > 8 && (
              <TouchableOpacity
                style={{ marginTop: Size.FindSize(10) }}
                onPress={() => {
                  Navigator.navigate(Route.PopularProduct, {
                    topPickList: topPickData,
                    isTopPickList: true,
                  });
                }}
              >
                <Text style={styles.viewAll}>{Strings.ViewAll}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
        {category?.length > 0 ? (
          <View style={styles.BrowseView}>
            <View style={styles.BrowseTextView}>
              <Text style={styles.BrowseText}>{Strings.BrowseText}</Text>
            </View>
            <FlatList
              data={category.slice(0, 8)}
              // horizontal={true}
              contentContainerStyle={{
                paddingRight: Size.FindSize(15),
                marginTop: Size.FindSize(5),
              }}
              numColumns={2}
              renderItem={renderBrowseCategory}
              showsHorizontalScrollIndicator={false}
            />
            {category?.length > 8 ? (
              <TouchableOpacity
                style={{ marginTop: Size.FindSize(10) }}
                onPress={() => {
                  Navigator.navigate(Route.AllBrowseCategory, {});
                }}
              >
                <Text style={styles.viewAll}>{Strings.ViewAll}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
        {popularData?.length > 0 ? (
          <View>
            <ImageBackground
              source={Images.back1}
              resizeMode="stretch"
              style={{ height: Size.FindSize(250) }}
            >
              <View style={[styles.bestView, {}]}>
                <Text style={styles.bestText}>{Strings.Popular_product}</Text>
              </View>
            </ImageBackground>
            <ImageBackground
              source={Images.popularProduct}
              resizeMode="stretch"
              style={[styles.Popularback, { marginTop: -Size.FindSize(170) }]}
            >
              <FlatList
                // horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingRight: Size.FindSize(15),
                  marginTop: Size.FindSize(15),
                  // height: Size.FindSize(280),
                }}
                numColumns={2}
                data={popularData.slice(0, 8)}
                renderItem={({ item }) => (
                  <CustomItemView
                    item={item}
                    listView={{ width: Size.width / 2 - Size.FindSize(25) }}
                    loginInfo={loginInfo ? true : false}
                    storeId={prefStoreId}
                  />
                )}
              />
              {popularData?.length > 8 && (
                <TouchableOpacity
                  onPress={() => {
                    Navigator.navigate(Route.PopularProduct, {});
                  }}
                >
                  <Text style={[styles.viewAll, { color: Colors.white }]}>
                    {Strings.ViewAll}
                  </Text>
                </TouchableOpacity>
              )}
            </ImageBackground>
          </View>
        ) : null}
        {newData?.length > 0 ? (
          <View style={styles.Popularback}>
            <View style={styles.BrowseTextView}>
              <Text style={styles.BrowseText}>{Strings.NewProduct}</Text>
            </View>
            <FlatList
              // horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: Size.FindSize(15),
                paddingTop: Size.FindSize(5),
              }}
              numColumns={2}
              data={newData.slice(0, 8)}
              renderItem={({ item }) => (
                <CustomItemView
                  item={item}
                  listView={styles.shadow}
                  loginInfo={loginInfo ? true : false}
                  storeId={prefStoreId}
                  // addToWishList={(id) => addToWishList(id)}
                />
              )}
            />
            {newData?.length > 8 && (
              <TouchableOpacity
                onPress={() => {
                  Navigator.navigate(Route.NewProducts, {});
                }}
              >
                <Text style={styles.viewAll}>{Strings.ViewAll}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {popularCategory?.length > 0 ? (
          <ImageBackground
            source={Images.redBack}
            resizeMode="stretch"
            style={styles.back2}
          >
            <View style={styles.bestView}>
              <Text style={styles.bestText}>{Strings.Popular_category}</Text>
              {/* <TouchableOpacity>
                <Image
                  source={Images.rightArrow}
                  resizeMode="contain"
                  style={styles.rightIcon}
                />
              </TouchableOpacity> */}
            </View>
            <FlatList
              data={popularCategory}
              style={{ paddingTop: Size.FindSize(30) }}
              renderItem={renderPopularCategory}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={false}
              bounces={false}
            />
          </ImageBackground>
        ) : null}
        <View style={styles.fairshopView}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.Why_Fairshop}</Text>
          </View>
          {/* <SliderBox
            images={whyFairshop}
            resizeMode="contain"
            onCurrentImagePressed={(index) =>
              Logger.log(`image ${index} pressed`)
            }
            inactiveDotColor={Colors.white}
            sliderBoxHeight={140}
            sliderBoxWidth={Size.width - 10}
            dotColor={Colors.Background}
            currentImageEmitter={(index) =>
              Logger.log(`current pos is: ${index}`)
            }
          /> */}
          <FlatList
            data={whyFairshop}
            // style={{ paddingTop: Size.FindSize(10) }}
            renderItem={renderWhereShop}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          />
        </View>
        {/* <View style={styles.cookView}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.today_cook}</Text>
          </View>
          <FlatList
            data={BrowseCategory}
            horizontal={true}
            contentContainerStyle={{ paddingRight: Size.FindSize(15) }}
            renderItem={renderCookItem}
            showsHorizontalScrollIndicator={false}
          />
        </View> */}
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
