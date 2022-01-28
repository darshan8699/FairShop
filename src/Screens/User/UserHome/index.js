//import liraries
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
  CATEGORY,
  HOMEPAGE_NEW_PRODUCT,
  HOMEPAGE_POPULAR_PRODUCT,
  HOME_BANNER,
  OFFERS,
  ADD_WISHLIST,
} from "../../../Utility/Constants";
import {
  showSuccessMessage,
  showErrorMessage,
  validateResponse,
} from "../../../Utility/Helper";
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
    const apiClass = new APICallService(CATEGORY, { limit: 10 });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          Logger.log("category data is---", res.data.data);
          setCategory(res.data.data);
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
        showErrorMessage(err.message);
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
              whyShop.push(element[0]);
            }
          }
          setBannerImages(bannerImage);
          setPopularCategory(res.data?.item?.content?.popular_category);
          setWhyFairshop(whyShop);
          Logger.log(whyShop);
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
  const renderBestItem = ({ item }) => (
    <Image source={{ uri: item?.bannerImage }} style={styles.bestImage} />
  );
  const renderBrowseCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.browseCard}
      onPress={() =>
        Navigator.navigate(Route.ShopCategoryWise, { categoryDetail: item })
      }
    >
      <Image
        source={
          item?.icon != null ? { uri: item.icon[0].url } : Images.placeholder
        }
        style={styles.browseImage}
      />
      <Text
        style={styles.browseCategoryText}
        numberOfLines={2}
        ellipsizeMode={"tail"}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const renderPopularCategory = ({ item }) => (
    <Image
      source={{ uri: item?.image[0]?.url }}
      style={styles.popularCatImage}
    />
  );
  const renderWhereShop = ({ item }) => (
    <Image
      source={{ uri: item?.url }}
      style={styles.WhyFairshopImage}
      // resizeMode={"cover"}
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
        <SliderBox
          images={bannerImages}
          resizeMode="cover"
          onCurrentImagePressed={(index) =>
            console.warn(`image ${index} pressed`)
          }
          inactiveDotColor={Colors.white}
          sliderBoxHeight={200}
          dotColor={Colors.Background}
          currentImageEmitter={(index) =>
            console.warn(`current pos is: ${index}`)
          }
        />
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
        <View style={styles.BrowseView}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.BrowseText}</Text>
            <TouchableOpacity>
              <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.browserightIcon}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={category}
            horizontal={true}
            contentContainerStyle={{ paddingRight: 15 }}
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
            <TouchableOpacity>
              <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.rightIcon}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 15 }}
            data={popularData}
            renderItem={({ item }) => (
              <CustomItemView
                item={item}
                addToWishList={(id) => addToWishList(id)}
              />
            )}
          />
        </ImageBackground>
        <View style={styles.Popularback}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.NewProduct}</Text>
            <TouchableOpacity>
              <Image
                source={Images.rightArrow}
                resizeMode="contain"
                style={styles.browserightIcon}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 15 }}
            data={newData}
            renderItem={({ item }) => (
              <CustomItemView
                item={item}
                listView={styles.shadow}
                addToWishList={(id) => addToWishList(id)}
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
          <FlatList
            data={whyFairshop}
            style={{ paddingTop: Size.FindSize(10) }}
            renderItem={renderWhereShop}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          />
          {/* <View style={styles.whyFairShopView}>
            <Image
              source={Images.whyFairShop}
              resizeMode={"contain"}
              style={styles.whyFairshopImage}
            />
            <Image
              source={Images.whyFairShop1}
              resizeMode={"contain"}
              style={styles.whyFairshopImage}
            />
          </View> */}
        </View>
        <View style={styles.cookView}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.today_cook}</Text>
          </View>
          <FlatList
            data={BrowseCategory}
            horizontal={true}
            contentContainerStyle={{ paddingRight: 15 }}
            renderItem={renderCookItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
