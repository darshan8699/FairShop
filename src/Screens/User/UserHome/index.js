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
// create a component
const MyComponent = (props) => {
  const images = [Images.test, Images.test, Images.test];
  const bestValues = [Images.test2, Images.test2];
  const BrowseCategory = [
    Images.test3,
    Images.test3,
    Images.test3,
    Images.test3,
  ];
  const renderBestItem = (item) => (
    <Image source={Images.test2} style={styles.bestImage} />
  );
  const renderBrowseCategory = (item) => (
    <View style={styles.browseCard}>
      <Image source={Images.test3} style={styles.browseImage} />
      <Text style={styles.browseCategoryText}>{"Fruits and Vegetables"}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      <ScrollView>
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
            renderItem={(item) => renderBestItem(item)}
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
            renderItem={(item) => renderBrowseCategory(item)}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <ImageBackground
          source={Images.back1}
          resizeMode="stretch"
          style={styles.back1}
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
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default MyComponent;
