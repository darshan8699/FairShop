//import liraries
import { decode } from "html-entities";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";
import APICallService from "../../../API/APICallService";
import { Regular } from "../../../Assets/fonts";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import {
  SETTING_ABOUT,
  SETTING_CAREERS,
  SETTING_CONTACT_US,
  SETTING_PRIVACY_POLICY,
  SETTING_REFUND_POLICY,
  SETTING_SHIPPING_POLICY,
  SETTING_TERMSANDCONDITIONS,
} from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import Logger from "../../../Utility/Logger";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component

const aboutUS = `<!DOCTYPE html><html> <head>
    <title>Downloads</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >
    <style type="text/css">
      body {
        margin: 0;
        padding-left: 12px;
        padding-right: 12px;
        // font-size: 14px;
        //font-family: ${Regular};
        font-family:sans-serif;
        background: #ffffff;
      }
    </style>
  </head><body><p>From the small town of Batala (Punjab) to the far heights of global recognition and reach, The Capital Group has become a foundation for ideals turned into real-time milestones. We grew from the land of industrious fervour, from 1970, under visionaries Shri Manohar Lal Agarwal &amp; Shri Naresh Agarwal, and reached the heights of success in manufacturing and worldwide export. Because of our strong belief in the quality of our products, we have won millions of hearts, and the love continues to ﬂow abundantly.</p><p>Today, The Capital Group has become the number one name in every household since we have redeﬁned the shopping experience. Our customer services and customer satisfaction is what makes this an achievable reality. Today we are one of the few who have reached the status of being the only name when grocery needs arise. Taking a step further towards making Capital Retail- a seamless grocery buying experience!</p><p>With more than half a century old expertise in the international catering market. Now, it has landed in India, Capital Retail is here to take the customer supermarket shopping experience to a more thrilling and modern outlook whilst, giving the consumer the ﬁnest quality of Indian agro-based products all at one stop shop.</p><p>As pioneers in mainstream catering in over 52 countries, we are adept at matching consumer expectations when it comes to their shopping experience, and that too, with a lifetime’s worth of trust! With Aarush Agarwal, as the Managing Director of this venture, the young leader aims just one thing- to take this legacy of his forefathers and turn it into an empire.</p><p>It is in this spirit that we are excited to revolutionize shopping as a landmark of the millennial, with The Fair Shop, by making this a young, new-age vision led by a youth-based journey. We are all geared up to make it not just a chain of supermarkets, but a holistic super-shopping hot-spot and our step closer in realizing the vision of a Global India so that, the top-shelf products are in the reach of every modern Indian retail buyer- with a store next to your home.</p></body></html>`;

const AboutUs = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [aboutData, setAboutData] = useState();
  const [pageType, setPageType] = useState(1);

  const webViewRef = useRef();
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      //componentDidMount
      setLoader(true);
      const type = props.route.params.type ? props.route.params.type : 1;
      setPageType(type);
      APICall();
    } else {
      //componentWillReceiveProps
    }
  }, []);

  const APICall = () => {
    Logger.log(props.route.params.type);
    const type = props.route.params.type ? props.route.params.type : 1;
    setLoader(true);
    const apiClass = new APICallService(
      type == 1
        ? SETTING_ABOUT
        : type == 2
        ? SETTING_REFUND_POLICY
        : type == 3
        ? SETTING_CAREERS
        : type == 4
        ? SETTING_REFUND_POLICY
        : type == 5
        ? SETTING_SHIPPING_POLICY
        : type == 6
        ? SETTING_TERMSANDCONDITIONS
        : type == 7
        ? SETTING_PRIVACY_POLICY
        : type == 8
        ? SETTING_CONTACT_US
        : SETTING_ABOUT
    );
    apiClass
      .callAPI()
      .then(async function (res) {
        if (validateResponse(res)) {
          var about = `<!DOCTYPE html><html> <head>
    <title>Downloads</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >
    <style type="text/css">
      body {
        margin: 0;
        padding-left: 12px;
        padding-right: 12px;
         font-size: 14px;
        font-family: ${Regular};
        // font-family:sans-serif;
        background: #ffffff;
      }
    </style>
  </head><body>${res.data?.item?.content}</body></html>`;
          Logger.log(res.data?.item?.content);
          setAboutData(decode(about));
          setLoader(false);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Loader2 modalVisible={isShowLoader} />
      <Header navigation={props.navigation} isBack />
      {/* <Header navigation={props.navigation} isBack isRightIcon={false} /> */}
      {pageType == 1 ? (
        <Text style={styles.headerText}>
          {pageType == 1 ? Strings.AboutUs : ""}
        </Text>
      ) : null}
      <WebView
        ref={webViewRef}
        cacheEnabled={false}
        scalesPageToFit={false}
        source={{ html: aboutData }}
        style={{
          backgroundColor: Colors.white,
        }}
        onLoad={() => setLoader(false)}
        onError={(error) => Logger.log(error)}
      />
    </View>
  );
};

//make this component available to the app
export default AboutUs;
