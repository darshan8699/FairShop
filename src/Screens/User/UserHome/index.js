//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../../../Components/Header";
import { SliderBox } from "react-native-image-slider-box";
import { Images } from "../../../Assets/images";
import Colors from "../../../Utility/Colors";
import styles from "./styles";
import Strings from "../../../Utility/Strings";
import { Size } from "../../../Utility/sizes";
import CustomItemView from "../../../Components/CustomItemView";
// create a component
const MyComponent = (props) => {
  const images = [Images.test, Images.test, Images.test];
  const bestValues = [Images.test2, Images.test2];
  const popularCategory = [Images.catTest, Images.catTest, Images.catTest];
  const BrowseCategory = [
    Images.test3,
    Images.test3,
    Images.test3,
    Images.test3,
  ];
  const popularProduct = [
    {
      image: Images.test3,
      name: "Apples",
      price: "193",
      veg: true,
    },
    {
      image: Images.test3,
      name: "Chicken Breast",
      price: "358",
      veg: false,
    },
    {
      image: Images.test3,
      name: "Apples",
      price: "193",
      veg: true,
    },
  ];
  const renderBestItem = ({ item }) => (
    <Image source={Images.test2} style={styles.bestImage} />
  );
  const renderBrowseCategory = ({ item }) => (
    <View style={styles.browseCard}>
      <Image source={Images.test3} style={styles.browseImage} />
      <Text style={styles.browseCategoryText}>{"Fruits and Vegetables"}</Text>
    </View>
  );
  const renderPopularCategory = ({ item }) => (
    <Image source={Images.catTest} style={styles.popularCatImage} />
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
      <ScrollView
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <SliderBox
          images={images}
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
            data={bestValues}
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
            data={BrowseCategory}
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
            data={popularProduct}
            renderItem={({ item }) => <CustomItemView item={item} />}
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
            data={popularProduct}
            renderItem={({ item }) => (
              <CustomItemView item={item} listView={styles.shadow} />
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
          />
        </ImageBackground>
        <View style={styles.fairshopView}>
          <View style={styles.BrowseTextView}>
            <Text style={styles.BrowseText}>{Strings.Why_Fairshop}</Text>
          </View>
          <View style={styles.whyFairShopView}>
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
          </View>
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
