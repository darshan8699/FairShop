import AsyncStorageLib from "@react-native-async-storage/async-storage";
//import liraries
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import WebView from "react-native-webview";
import APICallService from "../../../API/APICallService";
import Header from "../../../Components/Header";
import Loader2 from "../../../Components/Loader2";
import Colors from "../../../Utility/Colors";
import { PREF_STORE_ID, SETTING_CONTACT_US } from "../../../Utility/Constants";
import { showErrorMessage, validateResponse } from "../../../Utility/Helper";
import { Size } from "../../../Utility/sizes";
import Strings from "../../../Utility/Strings";
import styles from "./styles";

// create a component
const ContactUs = (props) => {
  const [isShowLoader, setLoader] = useState(false);
  const [contactDetail, setContactDetail] = useState();
  const [prefStoreId, setPrefStoreId] = useState("");
  const isFirstRun = useRef(true);

  const mapData = `<!DOCTYPE html>
<html>
<body>
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56072.56458644396!2d77.2440451!3d28.553684699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce33cf94fe555%3A0xe8948821bc8c42ad!2sFAIRSHOP!5e0!3m2!1sen!2sin!4v1639993826786!5m2!1sen!2sin" height="450" style="border:0;width:100%" loading="lazy"></iframe>
</body>
</html>`;

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      callFunction();
    }
  }, [props.currentFocus]);

  async function callFunction() {
    const store_id = await AsyncStorageLib.getItem(PREF_STORE_ID);
    setPrefStoreId(store_id);
    APICallContactDetail(store_id);
  }

  const APICallContactDetail = (store_id) => {
    setLoader(true);
    const apiClass = new APICallService(SETTING_CONTACT_US, {
      store_id: store_id,
    });
    apiClass
      .callAPI()
      .then(async function (res) {
        setLoader(false);
        if (validateResponse(res)) {
          setContactDetail(res.data.item.content);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorMessage(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Header isBack navigation={props.navigation} />

      <Loader2 modalVisible={isShowLoader} />

      <Text style={styles.headerText}>{Strings.ContactUs}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ height: Size.FindSize(200) }}>
          <WebView
            source={{
              html: contactDetail?.map_iframe,
            }}
            containerStyle={{ backgroundColor: Colors.Background }}
          />
        </View>
        {contactDetail && (
          <View styles={{ flex: 1 }}>
            <View
              style={[
                styles.headerViewStyle,
                {
                  alignSelf: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={styles.titleTextBold}>{Strings.Address}</Text>
              <Text style={styles.descText}>{contactDetail?.address}</Text>
            </View>
            <View style={[styles.headerViewStyle, {}]}>
              <Text style={styles.titleTextBold}>{Strings.CustomerCare}</Text>
              <Text style={styles.descText}>
                {contactDetail?.customer_care}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <View style={styles.headerViewStyle}>
                <Text style={styles.titleTextBold}>{Strings.officeTiming}</Text>
                <Text style={styles.descText}>
                  {contactDetail?.office_timing}
                </Text>
              </View>
              <View style={styles.headerViewStyle}>
                <Text style={styles.titleTextBold}>{Strings.Email}</Text>
                <Text style={styles.descText}>{contactDetail?.email}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default ContactUs;
