import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, TouchableOpacity, Button } from "react-native";
import { CustomText } from "../common/CustomText";
import AxiosInstance from "../utils/AxiosInstance";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

const imgWallet = require("../images/wallet.png");

const AskMoney = ({ navigation: { navigate }}) => {


  const [visibility, setVisibility] = useState(false);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const saveNewRequest = () => {
    AxiosInstance.post('request', {  
      amount: amount,
      reason: reason
    }).then(() => {
      setVisibility(!visibility)
      showMessage({
        message: "הבקשה שלך נשלחה להורים!",
        type: "success",
        textAlign: "right",
        duration: 3000,
        icon: "auto"
      })
      navigate("HomeChild");
    }).catch((err) => {
      setVisibility(!visibility)
      showMessage({
        message: "לא הצלחנו לשלוח את הבקשה להורים",
        description: "קרתה תקלה.. אולי ננסה שוב מאוחר יותר?",
        type: "danger",
        textAlign: "right",
        duration: 3000,
        icon: "auto",
      });
    })
  }
  return (
    <View style={styles.view}>
        <FlashMessage position="top" />
<CustomText style={styles.headline}>
    כמה כסף אתה צריך?
        </CustomText>
        <TextInput
         value={amount}
         onChangeText={setAmount}
            style={styles.input}
            keyboardType="numeric"
          />
        <CustomText style={styles.headline}>
    בשביל מה?
        </CustomText>
        <TextInput
         value={reason}
         onChangeText={setReason}
            style={styles.input}
          />
      <TouchableOpacity style={styles.button} onPress={saveNewRequest}>
      <CustomText style={styles.buttontext}>
    בקש כסף
        </CustomText>
        </TouchableOpacity>
        <Image
        source={imgWallet}
        style={styles.imgWallet} />
    </View>
    );
};

export default AskMoney;

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        marginTop: 90
      },
      button: {
        marginTop:30,
        alignItems: "center",
        borderRadius:30,
        backgroundColor: "#6A2C70",
        padding: 10
      },
      moneytype: {
        fontSize: 18
      },
      imgWallet: {
        width: 200,
        height: 178,
        marginTop: 50,
      },
      buttontext: {
        fontSize: 30,
        color: '#FFFFFF',
        marginLeft:10,
        marginRight:10
      },
      headline: {
        fontSize: 30,
        marginTop: 50
      },
      input: {
        marginTop: 20,
        textAlign: "right",
        borderBottomWidth: 1.0,
        width: 260,
        height: 35,
        marginBottom: 30,
        fontSize: 30,
      },
    })