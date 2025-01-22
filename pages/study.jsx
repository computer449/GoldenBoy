import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, ListView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CustomText } from "../common/CustomText";

const Study = ({ navigation: { navigate }, ...props }) => {
  if (!props.child) {
    return <></>;
  }

  const navigateQuiz = function () {
    navigate("Quiz");
  };

  const navigateSliderGame = function () {
    navigate("SliderGame");
  };

  return (
    <View style={styles.view}>
      <CustomText style={styles.headline}> ידע זה כוח </CustomText>
      <CustomText style={{ marginTop: 30 }}>איזה כיף שבאת {props.child.user.name.split(" ")[0]},</CustomText>
      <CustomText style={styles.textStyle}>ללמוד על כסף יכול להיות ממש כיף עם</CustomText>
      <CustomText style={styles.textStyle}> המשחקים והלומדות שלנו. </CustomText>
      <CustomText style={styles.textStyle}> אז למה אתה מחכה? בוא נתחיל לשחק </CustomText>
      <ScrollView>
        <View style={styles.images}>
          {/* <Image source={require('../assets/images/Read.jpg')} style={styles.img} /> */}
          <TouchableOpacity onPress={navigateSliderGame}>
            <Image source={require("../assets/images/GuessThePrice.jpg")} style={styles.img} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateQuiz}>
            <Image source={require("../assets/images/Quiz.jpg")} style={styles.img} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("Shopping")}>
            <Image source={require("../assets/images/Shopping.jpg")} style={styles.img} />
          </TouchableOpacity>
          {/* <Image source={require('../assets/images/Memory.jpg')} style={styles.img} /> */}
          {/* <Image source={require('../assets/images/Videos.jpg')} style={styles.img} /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Study;

const styles = StyleSheet.create({
  view: {
    marginTop: 70,
    alignItems: "center",
    flex: 1,
  },
  headline: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6A2C70",
  },
  textStyle: {
    marginTop: 3,
  },
  img: {
    width: 175,
    height: 150,
    marginTop: 40,
    marginLeft: 7,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "purple",
  },
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
});
