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
// create a component
const MyComponent = (props) => {
  const [currentindex, setcurrentindex] = useState(0);
  const flatListRef = useRef();
  const ImageData = [
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
    "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
  ];
  const renderImages = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.slideImageView,
        {
          borderColor:
            currentindex == index ? Colors.Background : Colors.cookBorder,
        },
      ]}
      onPress={() => setcurrentindex(index)}
    >
      <Image
        source={{
          uri: "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
        }}
        resizeMode="contain"
        style={styles.slideImage}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} isRightIcon={false} isBack />
      <ScrollView
        style={{
          padding: Size.FindSize(15),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageView}>
          <Image
            source={{
              uri: "https://d1j99e0b4sw4ql.cloudfront.net/119/_-STIRRED-BLOODY-MARY125ml-POUCH-(1)-copy.png",
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View>
          <FlatList
            ref={flatListRef}
            horizontal
            data={ImageData}
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
              if (currentindex != ImageData.length - 1) {
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
          {"Kissan Crunchy Peanut Butter"}
        </Text>
        <Text style={styles.brand}>Brand : {"Kissan"}</Text>
        <View style={styles.priceView}>
          <Text style={styles.price}>₹{"1400"}</Text>
          <View style={styles.horizontalView}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={Images.circleVeg}
                style={styles.circleFlag}
                resizeMode={"contain"}
              />
              <Text style={styles.flagText}>{"Pure Veg."}</Text>
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
        <Text style={styles.text}>
          {
            "Kissan Peanut Butter contains 100% real Peanuts handpicked from the farms of Gujarat. The superior grade Peanuts are perfectly roasted to give our product a smooth and creamy texture. Kissan Peanut Butter is naturally an excellent source of Protein and Zinc making it a great choice for growing kids as well as adults! Kissan Peanut Butter contains 100% real Peanuts handpicked from the farms of Gujarat. The superior grade Peanuts are perfectly roasted to give our product a smooth and creamy texture. Kissan Peanut Butter is naturally an excellent source of Protein and Zinc making it a great choice for growing kids as well as adults!Kissan Peanut Butter contains 100% real Peanuts handpicked from the farms of Gujarat. The superior grade Peanuts are perfectly roasted to give our product a smooth and creamy texture. Kissan Peanut Butter is naturally an excellent source of Protein and Zinc making it a great choice for growing kids as well as adults!"
          }
        </Text>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
