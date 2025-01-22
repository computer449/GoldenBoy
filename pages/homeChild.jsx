import React, { useState } from "react";
import { View, Text, Image, Modal, StyleSheet, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import { Button } from "../common/Button";

// calc that checks how many days more left for getting the allowance
// The date should be in format YYYY/MM/dd
// The frequency should be in days
const calcDaysLeftToAllowance = (props) => {
  let currentDate = new Date();
  var weekday = currentDate.toLocaleString("default", { weekday: "long" });

  // var beginDate = new Date(props.child.child.allowance.beginDate);
  // var endDate = new Date(props.child.child.allowance.endDate);

  // If there isn't allowance or the end date has passed
  if (
    // beginDate == "" ||
    // currentDate > endDate ||
    props.child.child.allowance.money == "0" ||
    props.child.child.allowance.money == undefined
  ) {
    return null;
  }

  // if (currentDate > beginDate) {
  //   // Get date diff in days
  //   var dateDiff = Math.floor((currentDate - beginDate) / (1000 * 60 * 60 * 24));

  //   return props.child.child.allowance.frequency - (dateDiff % props.child.child.allowance.frequency);
  // }

  // if (beginDate > currentDate) {
  //   // Get date diff in days
  //   return Math.floor((beginDate - currentDate) / (1000 * 60 * 60 * 24)) + 1;
  // }
};

const HomeChild = (props) => {
  // set frequency
  // let frequency = 0;

  // if (props.child.child.allowance.frequency == "יום") {
  //   frequency = 1;
  // } else if (props.child.child.allowance.frequency == "שבוע") {
  //   frequency = 7;
  // } else if (props.child.child.allowance.frequency == "חודש") {
  //   frequency = 30;
  // }

  if (!props.child) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}></View>;
  }

  let daysToAllownce = calcDaysLeftToAllowance(props);
  let isThereActiveAllowance;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop:40 }}>
      <CustomText style={{ fontSize: 45 }}> היי {props.child.user.name} ! </CustomText>
      <CustomText style={{ fontSize: 35 }}> עד עכשיו חסכת </CustomText>
      <View style={{ marginTop: 20, flexDirection: "row" }}>
        <Image source={require("../images/shekel.png")} style={{ width: 30, height: 30, marginTop: 50 }} />
        <CustomText style={{ fontSize: 80 }}> {props.child.child.money} </CustomText>
      </View>
      <CustomText style={{ fontSize: 32, marginTop: 20 }}> כל הכבוד! </CustomText>
      {props.child.child.allowance.money === "0" ? (
        <></>
      ) : (
        <>
          <CustomText style={{ fontSize: 18, marginTop: 15 }}>
            דמי הכיס שלך מגיעים ביום {props.child.child.allowance.day} כל {props.child.child.allowance.frequency}
          </CustomText>
          <CustomText style={{ fontSize: 18 }}> ותקבל עוד {props.child.child.allowance.money} ש"ח. </CustomText>
        </>
      )}

      {/* {daysToAllownce !== null ? (
        daysToAllownce == frequency ? (
          <>
            <CustomText style={{ fontSize: 18, marginTop: 15 }}> דמי הכיס שלך מגיעים היום. איזה כיף! </CustomText>
            <CustomText style={{ fontSize: 18 }}> קיבלת עוד {props.child.child.allowance.money} ש"ח. </CustomText>
          </>
        ) : (
          <>
            <CustomText style={{ fontSize: 18, marginTop: 15 }}>
              {" "}
              דמי הכיס הבאים שלך מגיעים בעוד {daysToAllownce} ימים{" "}
            </CustomText>
            <CustomText style={{ fontSize: 18 }}>
              {" "}
              ואז תקבל עוד {props.child.child.allowance.money} ש"ח. איזה כיף!{" "}
            </CustomText>
          </>
        )
      ) : (
        <></>
      )} */}

      <Image
        style={{ width: 300, height: 250, marginTop: 15, marginBottom: 40 }}
        source={require("../assets/images/pig.png")}
      />
      <Button
        title="אני רוצה להשתמש בכסף"
        color="#6A2C70"
        onPress={() => {
          props.navigation.navigate("AskMoney");
        }}
      />
    </View>
  );
};

export default HomeChild;
