import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import AxiosInstance from "../utils/AxiosInstance";
import { showMessage } from "react-native-flash-message";
import { TouchableHighlight } from "react-native-gesture-handler";

const img = require("../images/LoginPage.png");

const Login = ({ navigation: { navigate } }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    AxiosInstance.post("user/login", {
      userId: id,
      password: password,
    })
      .then((res) => {
        // Always attach token to axios requests header
        AxiosInstance.defaults.headers.common = {
          Authorization: "Bearer " + res.data.token,
        };

        // Get Indication from server which type is the user
        AxiosInstance.get("/user/isParent")
          .then((isPersonParent) => (isPersonParent.data === true ? navigate("ParentTabs") : navigate("ChildTabs")))
          .catch((err) => console.log(err));
      })
      .catch((err) =>
        showMessage({
          message: "ארעה שגיאה בהתחברות",
          description: "משתמש אינו קיים",
          type: "error",
          textAlign: "right",
        })
      );
  };
  return (
    <View style={styles.view}>
      <CustomText style={styles.welcome}>ברוכים הבאים ל- GOLDENBOY !</CustomText>
      <Image source={img} style={styles.img} />
      <CustomText style={styles.inputHeadline}>תעודת זהות</CustomText>
      <TextInput value={id} onChangeText={(id) => setId(id)} style={styles.input} />
      <CustomText style={styles.inputHeadline}>סיסמא</CustomText>
      <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TouchableHighlight onPress={handleLogin}>
        <CustomText style={styles.loginButton}>התחבר</CustomText>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigate("Register")}>
        <CustomText style={styles.loginButton}>הורה? הירשם עכשיו</CustomText>
      </TouchableHighlight>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  welcome: {
    color: '#BAC900',
    marginTop: 30,
    fontSize: 30,
  },
  view: {
    alignItems: "center",
    marginTop: 50,
  },
  img: {
    width: 200,
    height: 178,
    marginTop: 70,
    marginBottom: 40,
  },
  input: {
    height: 40,
    width: 180,
    marginBottom: 20,
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
  },
  inputHeadline: {
    color: '#BAC900',
    fontSize: 18,
    marginBottom: 15,
  },
  loginButton: {
    color: "#BAC900",
    marginTop: 40,
    fontSize: 16,
  },
});
