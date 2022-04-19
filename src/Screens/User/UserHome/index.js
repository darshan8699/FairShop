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

  const BrowseCategory = [
    Images.test3,
    Images.test3,
    Images.test3,
    Images.test3,
  ];
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      APICallWishList();
      GetPopularProductData();
      GetNewProductData();
      GetBrowseCategory();
      APICallOffers();
      APICallBanner();
    }
  });

  const GetPopularProductData = () => {
    setLoader(true);
    const apiClass = new APICallService(HOMEPAGE_POPULAR_PRODUCT);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setPopularData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const GetNewProductData = () => {
    setLoader(true);
    const apiClass = new APICallService(HOMEPAGE_NEW_PRODUCT);
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setNewData(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const GetBrowseCategory = () => {
    setLoader(true);
    const apiClass = new APICallService(CATEGORY, { limit: -1 });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("category data is---", res.data.items);
          setCategory(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };
  const APICallOffers = () => {
    setLoader(true);
    const apiClass = new APICallService(OFFERS, {});
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setBestValueOffers(res.data?.values[0]?.couponsNew);
        }
      })
      .catch((err) => {
        setLoader(false);
        // showErrorMessage(err.message);
      });
  };
  const APICallBanner = () => {
    setLoader(true);
    const apiClass = new APICallService(HOME_BANNER, {});
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
          console.log("bannerImage:-", bannerImage);
          setBannerImages(bannerImage);
          console.log(
            "popular category:-",
            JSON.stringify(res.data?.item?.content?.popular_category)
          );
          setPopularCategory(res.data?.item?.content?.popular_category);
          setWhyFairshop(whyShop);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  const APICallWishList = () => {
    setLoader(true);
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

  // const addToWishList = (product_item_code) => {
  //   Logger.log("product_item_code", product_item_code);
  //   AsyncStorage.getItem(ALL_WISHLIST, (err, result) => {
  //     const id = [product_item_code];
  //     if (result !== null && result != product_item_code) {
  //       var newIds = JSON.parse(result).concat(id);
  //       AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(newIds));
  //       setLoader(true);
  //       const apiClass = new APICallService(ADD_WISHLIST, {
  //         product_item_code: newIds,
  //       });
  //       apiClass
  //         .callAPI()
  //         .then(async function (res) {
  //           setLoader(false);
  //           if (validateResponse(res)) {
  //             showSuccessMessage(res.message);
  //           }
  //         })
  //         .catch((err) => {
  //           setLoader(false);
  //           showErrorMessage(err.message);
  //         });
  //       console.log("all wishlist---------", newIds);
  //     } else {
  //       AsyncStorage.setItem(ALL_WISHLIST, JSON.stringify(id));
  //       setLoader(true);
  //       const apiClass = new APICallService(ADD_WISHLIST, {
  //         product_item_code: id,
  //       });
  //       apiClass
  //         .callAPI()
  //         .then(async function (res) {
  //           setLoader(false);
  //           if (validateResponse(res)) {
  //             showSuccessMessage(res.message);
  //           }
  //         })
  //         .catch((err) => {
  //           setLoader(false);
  //           showErrorMessage(err.message);
  //         });
  //       Logger.log("single wishlist--------");
  //     }
  //   });
  // };
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

  const renderPopularCategory = ({ item, index }) => (
    <Image
      key={index}
      source={{ uri: item?.image[0]?.url }}
      style={styles.popularCatImage}
    />
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
        {bestValueOffers.length > 0 && (
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
        )}
        <View style={styles.BrowseView}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.BrowseText}</Text>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                Navigator.navigate(Route.AllBrowseCategory, {});
              }}
            >
              <Text style={styles.viewAll}>{Strings.ViewAll}</Text>
              {/* <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.browserightIcon}
              /> */}
            </TouchableOpacity>
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
        </View>
        <ImageBackground
          source={Images.back1}
          resizeMode="stretch"
          style={styles.Popularback}
        >
          <View style={styles.bestView}>
            <Text style={styles.bestText}>{Strings.Popular_product}</Text>
            <TouchableOpacity
              onPress={() => {
                Navigator.navigate(Route.PopularProduct, {});
              }}
            >
              <Text style={[styles.viewAll, { color: Colors.white }]}>
                {Strings.ViewAll}
              </Text>
              {/* <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.rightIcon}
              /> */}
            </TouchableOpacity>
          </View>
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
              />
            )}
          />
        </ImageBackground>
        <View style={styles.Popularback}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.NewProduct}</Text>
            <TouchableOpacity
              onPress={() => {
                Navigator.navigate(Route.NewProducts, {});
              }}
            >
              <Text style={styles.viewAll}>{Strings.ViewAll}</Text>
              {/* <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.browserightIcon}
              /> */}
            </TouchableOpacity>
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
                // addToWishList={(id) => addToWishList(id)}
              />
            )}
          />
        </View>
        <ImageBackground
          source={Images.redBack}
          resizeMode="stretch"
          style={styles.back2}
        >
          <View style={styles.bestView}>
            <Text style={styles.bestText}>{Strings.Popular_category}</Text>
            <TouchableOpacity>
              <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.rightIcon}
              />
            </TouchableOpacity>
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
