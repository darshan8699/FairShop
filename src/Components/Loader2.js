import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import Colors from "../Utility/Colors";
import { Size } from "../Utility/sizes";
import LottieView from "lottie-react-native";

const Loader2 = (props) => {
  const { modalVisible, onDismiss } = props;

  return (
    <Modal
      animationType="none"
      transparent={modalVisible}
      visible={modalVisible}
    >
      <View
        style={{
          height: Size.height,
          width: Size.width,
          zIndex: 8,
          position: "absolute",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <ActivityIndicator size="large" color={Colors.Background} />
        {/* <LottieView
          source={{
            uri: "https://assets5.lottiefiles.com/packages/lf20_bxovyc6c.json",
          }}
        /> */}
        {/* <LottieView source={require("../Assets/imageuploading.json")} /> */}
      </View>
    </Modal>
  );
};
export default Loader2;
