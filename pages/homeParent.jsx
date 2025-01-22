import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, TextInput, View, FlatList, Text } from "react-native";
import { showMessage } from "react-native-flash-message";
import { CustomText } from "../common/CustomText";
import { Button } from "../common/Button";
import AxiosInstance from "../utils/AxiosInstance";
const imageParents = require("../assets/images/parents.png");
import axios from "axios";

const HomeParent = (props) => {
  if (!props.parent) {
    return <></>;
  }

  const [children, setChildren] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [reduceMode, setReduceMode] = useState(false);
  const [amountToChange, setAmountToChange] = useState(0);
  const [childrenToChange, setChildrenToChange] = useState([]);

  const getChildren = () => {
    props.parent.children.forEach((child) => {
      AxiosInstance.get("child", {
        params: {
          children: props.parent.children,
        },
      }).then((resp) => {
        setChildren(resp.data);
      });
    });
  };

  const chooseToAdd = (child) => {
    setChildrenToChange([]);
    if (child) {
      childrenToChange.push(child);
    } else {
      setChildrenToChange(children);
    }
    setAddMode(true);
  };

  const chooseToReduce = (child) => {
    setChildrenToChange([]);
    if (child) {
      childrenToChange.push(child);
    } else {
      setChildrenToChange(children);
    }
    setReduceMode(true);
  };

  const addMoney = () => {
    let promises = [];
    childrenToChange.forEach((child) => {
      promises.push(AxiosInstance.put("child/updatemoney/" + child.user.idNumber, { money: amountToChange }));
    });
    axios
      .all(promises)
      .then((resp) => {
        setAddMode(false);
        showMessage({
          message: "הכסף נוסף בהצלחה",
          type: "success",
          textAlign: "right",
          duration: 3000,
          icon: "auto",
        });
        setAmountToChange(0);
        setChildrenToChange([]);
        getChildren();
      })
      .catch((err) => {
        setAddMode(false);
        showMessage({
          message: "לא הצלחנו להוסיף את הכסף",
          description: "קרתה תקלה.. אולי ננסה שוב מאוחר יותר?",
          type: "danger",
          textAlign: "right",
          duration: 3000,
          icon: "auto",
        });
        setAmountToChange(0);
        setChildrenToChange([]);
      });
  };

  const reduceMoney = () => {
    let promises = [];
    childrenToChange.forEach((child) => {
      promises.push(AxiosInstance.put("child/updatemoney/" + child.user.idNumber, { money: amountToChange * -1 }));
    });
    axios
      .all(promises)
      .then((resp) => {
        setReduceMode(false);
        showMessage({
          message: "הכסף ירד בהצלחה",
          type: "success",
          textAlign: "right",
          duration: 3000,
          icon: "auto",
        });
        setAmountToChange(0);
        setChildrenToChange([]);
        getChildren();
      })
      .catch((err) => {
        setReduceMode(false);
        showMessage({
          message: "לא הצלחנו להוריד את הכסף",
          description: "קרתה תקלה.. אולי ננסה שוב מאוחר יותר?",
          type: "danger",
          textAlign: "right",
          duration: 3000,
          icon: "auto",
        });
        setAmountToChange(0);
        setChildrenToChange([]);
      });
  };

  useEffect(() => {
    getChildren();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomText
        style={{
          fontSize: 30,
          marginTop: 65,
          color: "#6A2C70",
        }}>
        מצב הילדים שלי
      </CustomText>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.modalButton}>
          <Button
            onPress={() => {
              chooseToReduce();
            }}
            color='#FFB000'
            title="הורד לכולם"
          />
        </View>
        <View style={styles.modalButton}>
          <Button
            onPress={() => {
              chooseToAdd();
            }}
            color='#FFB000'
            title="הוסף לכולם"
          />
        </View>
      </View>
      <FlatList
        data={children}
        renderItem={({ item }) => {
          return (
            <View style={{ flexDirection: "row" }}>
              <View style={styles.plusButtonView}>
                <Button
                  style={styles.plusButton}
                  onPress={(item) => {
                    chooseToReduce(item.child);
                  }}
                  title="-"
                  color='#FFB000'
                />
              </View>
              <View style={styles.plusButtonView}>
                <Button
                  onPress={(item) => {
                    chooseToAdd(item.child);
                  }}
                  color='#FFB000'
                  title="+"
                />
              </View>
              <View style={{ margin: 15 }}>
                <CustomText style={styles.money}>
                  {item.child.money}
                  <CustomText style={styles.moneytype}>ש"ח</CustomText>
                </CustomText>
              </View>
              <View style={{ margin: 15 }}>
                <Text
                  style={styles.smallHeadline}
                  onPress={() => {
                    props.navigation.navigate("ChildView", { child: item, parent: props.parent });
                  }}>
                  {item.user.name}
                </Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(child) => child.user._id}
      />
      <View style={styles.modalButton}>
        <Button
          onPress={() => {
            props.navigation.navigate("RegisterChild");
          }}
          color='#FFB000'
          title="הוספת ילד"
        />
      </View>
      <View>
        <Image source={imageParents} style={styles.imgParents} />
      </View>
      <Modal
        transparent={true}
        animationType={"slide"}
        visible={addMode}
        onRequestClose={() => {
          setAddMode(false);
        }}
        onBackdropPress={() => {
          setAddMode(false);
        }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.ModalInsideView}>
            <CustomText style={styles.inputHeadline}>כמה כסף להוסיף?</CustomText>
            <TextInput value={amountToChange.toString()} onChangeText={setAmountToChange} style={styles.input} />
            <CustomText>ש"ח</CustomText>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.modalButton}>
                <Button color="#FFB000" title="הוספה" onPress={addMoney} />
              </View>
              <View style={styles.modalButton}>
                <Button
                  color="#FFB000"
                  title="ביטול"
                  onPress={() => {
                    setAddMode(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType={"slide"}
        visible={reduceMode}
        onRequestClose={() => {
          setReduceMode(false);
        }}
        onBackdropPress={() => {
          setReduceMode(false);
        }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.ModalInsideView}>
            <CustomText style={styles.inputHeadline}>כמה כסף להוריד?</CustomText>
            <TextInput value={amountToChange.toString()} onChangeText={setAmountToChange} style={styles.input} />
            <CustomText>ש"ח</CustomText>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.modalButton}>
                <Button color="#FFB000" title="הורדה" onPress={reduceMoney} />
              </View>
              <View style={styles.modalButton}>
                <Button
                  color="#FFB000"
                  title="ביטול"
                  onPress={() => {
                    setReduceMode(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeParent;

const styles = StyleSheet.create({
  ModalInsideView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6A2C70",
    height: 450,
    width: "80%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcome: {
    fontSize: 25,
    marginBottom: 20,
    color: "white",
  },
  input: {
    height: 40,
    width: 180,
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 2,
    padding: 5,
    textAlign: "center",
  },
  inputHeadline: {
    fontSize: 18,
    marginBottom: 15,
    color: "white",
  },
  modalButton: {
    margin: 16,
    width: 100,
  },
  plusButtonView: {
    margin: 13,
    marginTop: 25,
    width: 30,
    borderRadius: 40,
  },
  plusButton: {
    borderRadius: 20,
  },
  value: {
    fontSize: 30,
    marginTop: 15,
  },
  view: {
    alignItems: "center",
    marginTop: 120,
  },
  money: {
    alignItems: "center",
    fontSize: 30,
    marginTop: 10,
  },
  moneytype: {
    alignItems: "center",
    fontSize: 18,
    marginRight: 5,
  },
  imgPresent: {
    width: 200,
    height: 178,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#6A2C70",
  },
  smallHeadline: {
    fontSize: 20,
    marginTop: 15,
    color: "#6A2C70",
  },
  date: {
    alignItems: "center",
    fontSize: 15,
  },
  table: {
    height: 330,
    marginTop: 60,
    marginLeft: 40,
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  imgParents: {
    width: 230,
    height: 200,
    marginBottom: 30,
    marginTop: 20,
  },
});
