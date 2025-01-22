import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView, Text, Modal } from "react-native";
import { CustomText } from "../../../common/CustomText";
import { Button } from "../../../common/Button";
import { productsData } from "./shopping-game-data";
import { FlatList } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";

const Shopping = ({ navigation: { navigate } }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [mixedProducts, setMixedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [givenMoney, setGivenMoney] = useState(0);
  const [successFlag, setSuccessFlag] = useState(false);
  const [amountOfProductsToWin, setAmountOfProductsToWin] = useState(0);
  const [optimumMoneyUsage, setOptimumMoneyUsage] = useState(0);
  const [isModalShown, setIsModalShown] = useState(false);
  const [winningCartExample, setWinningCartExample] = useState([]);
  const backgroundImage = require("../../../images/shopping_game/background2.png");
  const winImage = require("../../../assets/images/win.png");

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    let lastIndex = 0;
    let amountOfProducts = 0;
    let MoneyUsage = 0;
    let winningCombinationExample = [];
    let money = Math.round(1 + Math.random() * (8 - 1)) * 10;

    //sort products by price low to high
    let productsSortedByPrice = productsData.sort((a, b) => (a.price > b.price ? 1 : -1));

    // check the optimum products amount to win
    productsSortedByPrice.forEach((product, index) => {
      if (product.price + MoneyUsage <= money) {
        winningCombinationExample.push(product);
        MoneyUsage += product.price;
        amountOfProducts = amountOfProducts + 1;
        lastIndex = index;
      }
    });

    setSelectedProducts([]);
    setSuccessFlag(false);
    setGivenMoney(money);
    setWinningCartExample(winningCombinationExample);
    setOptimumMoneyUsage(MoneyUsage);
    setAmountOfProductsToWin(amountOfProducts);

    let randomNumber = Math.round(1 + Math.random() * (6 - 1)) + lastIndex;
    productsSortedByPrice = productsSortedByPrice.slice(0, randomNumber);

    const shuffledProducts = productsSortedByPrice.sort(() => Math.random() - 0.5);
    setMixedProducts(shuffledProducts);
  };

  const itemPressed = (productName) => {
    let newArray = [...selectedProducts];
    let productIndex = selectedProducts.findIndex((prod) => prod === productName);

    // add is not exist otherwise remove item from selected products array
    productIndex === -1 ? newArray.push(productName) : newArray.splice(productIndex, 1);
    setSelectedProducts(newArray);
  };

  const checkCart = () => {
    // Check if this is the optimum product selection
    if (amountOfProductsToWin == selectedProducts.length) {
      let overallCost = selectedProducts.reduce(
        (total, productName) => total + mixedProducts.find((prod) => prod.name == productName).price,
        0
      );
      if (overallCost <= givenMoney) {
        setSuccessFlag(true);
      }
    }

    setIsModalShown(true);
  };

  return isGameStarted ? (
    <View style={styles.cont}>
      <View style={styles.gameTitle}>
        <CustomText style={{ fontSize: 40, fontWeight: "bold" }}>התקציב שעומד </CustomText>
        <CustomText style={{ fontSize: 40, fontWeight: "bold" }}> לרשותך - {givenMoney} ש"ח</CustomText>
      </View>
      <ScrollView style={styles.scroller}>
        <View style={styles.gameImages}>
          {mixedProducts.map((product, index) => {
            return (
              <View key={product.name}>
                <Text style={{ marginLeft: 70 }}>{product.name}</Text>
                <TouchableOpacity onPress={() => itemPressed(product.name)}>
                  <Image
                    style={
                      selectedProducts.includes(product.name) ? styles.clickedImageStyle : styles.productsImagestyle
                    }
                    source={product.pic}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.finishButton}>
        <Button title="בדוק!" color="#6C63FC" onPress={() => checkCart()}></Button>
        <Button title=" יציאה מהמשחק" color="#6C63FC" onPress={() => navigate("Study")}></Button>
      </View>
      <Modal transparent={true} animationType={"slide"} visible={isModalShown}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {successFlag ? (
            <View style={styles.ModalInsideView}>
              <Image source={winImage} style={{ height: 180, width: "100%" }} />
              <CustomText style={styles.popupHeadline}>כל הכבוד הצלחת!</CustomText>
              <View style={styles.modalButton}>
                <Button
                  color="#6C63FC"
                  title="לשלב הבא"
                  onPress={() => {
                    setIsModalShown(false);
                    startNewGame();
                  }}
                />
              </View>
              <View style={styles.modalButton}>
                <Button title=" יציאה מהמשחק" color="#6C63FC" onPress={() => navigate("Study")}></Button>
              </View>
            </View>
          ) : (
            <View style={styles.ModalInsideView}>
              <CustomText style={styles.popupHeadline}>מצטערים זו </CustomText>
              <CustomText style={styles.popupHeadline}> תשובה לא נכונה</CustomText>
              <CustomText style={styles.popupText}> הנה דוגמא לעגלת קניות אפשרית:</CustomText>
              <View style={{ width: "70%" }}>
                <DataTable>
                  <FlatList
                    data={winningCartExample}
                    renderItem={({ item }) => {
                      return (
                        <DataTable.Row key={item.name} style={{ alignContent: "center" }}>
                          <DataTable.Cell style={{ flex: 4 }}>
                            <CustomText>{item.price} ש"ח</CustomText>
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={{ flex: 7, alignSelf: "center" }}>
                            <CustomText>{item.name}</CustomText>
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    }}
                    // key={}
                    keyExtractor={(historyitem) => historyitem.name}
                  />
                </DataTable>
              </View>

              <View style={styles.modalButton}>
                <Button
                  color="#6C63FC"
                  title="לשלב הבא"
                  onPress={() => {
                    setIsModalShown(false);
                    startNewGame();
                  }}
                />
              </View>
              <View style={styles.modalButton}>
                <Button title=" יציאה מהמשחק" color="#6C63FC" onPress={() => navigate("Study")}></Button>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  ) : (
    <ImageBackground source={backgroundImage} style={styles.image}>
      <View style={styles.view}>
        <CustomText style={styles.introTitle}>משחק קניות</CustomText>
        <CustomText style={styles.introText}>לפנייך תוצג רשימת מוצרים שונים</CustomText>
        <CustomText style={styles.introText}>שיופיעו ללא המחיר שלהם.</CustomText>
        <CustomText style={styles.introText}>עלייך להכניס כמה שיותר מוצרים</CustomText>
        <CustomText style={styles.introText}>לעגלה בתקציב שניתן לך. בהצלחה!</CustomText>
        <View style={{ marginTop: 20 }}>
          <Button title="התחל במשחק" color="#6C63FC" onPress={() => setIsGameStarted(true)}></Button>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Shopping;

const styles = StyleSheet.create({
  cont: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
  },
  productsImagestyle: {
    width: 160,
    height: 160,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  clickedImageStyle: {
    width: 160,
    height: 160,
    borderColor: "#cc33ff",
    borderWidth: 3,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  view: {
    marginTop: 70,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  introText: {
    margin: 5,
    fontSize: 22,
    fontWeight: "bold",
  },
  introTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gameTitle: {
    borderStyle: "solid",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 70,

    backgroundColor: "#e6b3ff",
  },
  gameImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  finishButton: {
    marginBottom: 20,
    fontSize: 20,
  },
  ModalInsideView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeccff",
    minHeight: 350,
    width: "80%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "grey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupHeadline: {
    margin: 10,
    fontSize: 36,
    marginBottom: 15,
  },
  popupText: {
    fontSize: 20,
    marginBottom: 15,
  },
  modalButton: {
    margin: 5,
    // width: 100,
  },
});
