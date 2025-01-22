import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, TextInput, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Button } from "../common/Button";
import { CustomText } from "../common/CustomText";
import AxiosInstance from "../utils/AxiosInstance";

const imgPresent = require("../images/present.png");


const Goal = (props) => {
  const [visibility, setVisibility] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [childMoney, setChildMoney] = useState();
  const [daysLeft, setDaysLeft] = useState("");
  const getLatestGoal = () => {
    AxiosInstance.get('goals').then((resp) => {
      setDescription(resp.data.description);
      setAmount(resp.data.amount);
      getChildMoney(resp.data.amount);
    })
  }
  const getChildMoney = (currAmount) => {
    AxiosInstance.get("/user/_id").then((res) => {
      AxiosInstance.post("/child", { childId: res.data.toString() }).then((resp) => {
        setChildMoney(resp.data.child.money);
        let currChildMoney = resp.data.child.money;
        setRemainingAmount((currAmount > currChildMoney && currChildMoney > 0) ? currAmount - currChildMoney : currAmount);
      }).catch((err) =>  console.log(err));
    }).catch((err) => console.log(err));
  }
  const getGoalPrediction = () => {
    AxiosInstance.post('goals/predict').then((res) => {
      if (res.data.daysLeft > 0) {
        setDaysLeft("בקצב הזה, עוד בערך " + res.data.daysLeft + " ימים נגיע למטרה!")
      } else {
        setDaysLeft("נראה שכרגע אנחנו מפסידים כסף במקום להרוויח.. אולי ננסה לעשות מטלות בבית?")
      }
    }).catch((err) => {
      setDaysLeft("אנו מתקשים לחזות כמה ימים ייקח להגיע למטרה.. שווה לנסות להרוויח קצת כסף ולבדוק מאוחר יותר")
      console.log(err)
    })
  }
  const saveNewGoal = () => {
    AxiosInstance.post('goals', {
      description: description,
      amount: amount,
      isAchieved: false
    }).then((goal) => {
      setVisibility(!visibility)
      showMessage({
        message: "המטרה נשמרה בהצלחה!",
        type: "success",
        textAlign: "right",
        duration: 3000,
        icon: "auto"
      });
      getLatestGoal();
    }).catch((err) => {
      setVisibility(!visibility)
      showMessage({
        message: "לא הצלחנו לשמור את המטרה",
        description: "קרתה תקלה.. אולי ננסה שוב מאוחר יותר?",
        type: "danger",
        textAlign: "right",
        duration: 3000,
        icon: "auto",
      });
    })
  }

  useEffect(() => {
    getLatestGoal();
    getGoalPrediction();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlashMessage />
      <CustomText style={styles.headline}>
        {description}
      </CustomText>
      <CustomText style={styles.money}>
        {amount ? amount.toString() : amount}
        <CustomText style={styles.moneytype}>
          ש"ח
        </CustomText>
      </CustomText>
      <Image
        source={imgPresent}
        style={styles.imgPresent} />
      <CustomText style={styles.smallHeadline}>
        נשאר לך לחסוך:
        </CustomText>
      <CustomText style={styles.value}>
        {remainingAmount ? remainingAmount.toString() : remainingAmount}
        <CustomText style={styles.moneytype}>
          ש"ח
        </CustomText>
      </CustomText>
      <CustomText style={styles.smallHeadline}>
        כדי להגיע ליעד
        </CustomText>
      <CustomText style={styles.smallHeadline}>
        טיפ מאיתנו:
        </CustomText>
      <CustomText style={styles.text}>
        כדי להגיע ליעד, אולי תבצע מטלה?
        </CustomText>
      <CustomText style={styles.text}>
        ככה גם תעזור בבית וגם תצבור עוד כסף
        </CustomText>
      <CustomText style={styles.smallHeadline}>
        {daysLeft.toString()}
        </CustomText>

      <View style={{ flexDirection: "row" }}>
        <View style={styles.modalButton}>
          <Button onPress={() => {
            props.navigation.navigate("Chores", { child: props.child });
          }} title="לרשימת המטלות" />
        </View>

        <View style={styles.modalButton}>
          <Button onPress={() => { setVisibility(!visibility) }} title="יצירת מטרה חדשה" />
        </View>
      </View>

      <Modal
        transparent={true}
        animationType={"slide"}
        visible={visibility}
        onRequestClose={() => { setVisibility(!visibility) }}
        onBackdropPress={() => { setVisibility(!visibility) }}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.ModalInsideView}>
            <CustomText style={styles.welcome}>הגיע הזמן להשתדרג!</CustomText>
            <CustomText
              style={styles.inputHeadline}>
              מה נרצה לקנות?
            </CustomText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={styles.input} />
            <CustomText
              style={styles.inputHeadline}>
              כמה זה עולה?
            </CustomText>
            <TextInput
              value={amount ? amount.toString(): ''}
              onChangeText={setAmount}
              style={styles.input} />
            <View style={{ flexDirection: "row" }}>
              <View style={styles.modalButton}>
                <Button color="#6C63FC" title="שמירה" onPress={saveNewGoal} />
              </View>
              <View style={styles.modalButton}>
                <Button color="#6C63FC" title="ביטול" onPress={() => { setVisibility(!visibility) }} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({

  ModalInsideView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#63a5fc",
    height: 450,
    width: '80%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  welcome: {
    fontSize: 25,
    marginBottom: 20,
    color: "white"
  },
  input: {
    height: 40,
    width: 180,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    padding: 5,
    textAlign: "center"
  },
  inputHeadline: {
    fontSize: 18,
    marginBottom: 15,
    color: "white"
  },
  modalButton: {
    margin: 16,
    width: 100,
  },
  headline: {
    fontSize: 40,
    marginTop: 15,
    color: '#6A2C70'
  },
  value: {
    fontSize: 30,
    marginTop: 15
  },
  view: {
    alignItems: "center",
    marginTop: 120
  },
  money: {
    alignItems: "center",
    fontSize: 30,
    marginTop: 10
  },
  moneytype: {
    alignItems: "center",
    fontSize: 18,
    marginRight: 5
  },
  imgPresent: {
    width: 200,
    height: 178,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#6A2C70'
  },
  smallHeadline: {
    fontSize: 20,
    marginTop: 15,
    color: '#6A2C70'
  },
  text: {
    fontSize: 17,
    textAlign: "center"
  }
});
