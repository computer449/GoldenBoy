import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { CustomText } from "../../common/CustomText";
import { CheckBox } from 'react-native-elements'
import { Button } from "../../common/Button";
import Slider from '@react-native-community/slider';
import FlashMessage, { showMessage } from "react-native-flash-message";
import AxiosInstance from "../../utils/AxiosInstance";
import { picsData } from "./slider_data";


const SliderGame = ({ navigation: { navigate } }) => {
    const [questions, setQuestions] = useState("");
    const [currQuestion, setCurrQuestion] = useState(0)
    const [guessValue, setGuessValue] = useState(0)
    const [tries, setTries] = useState(2);
    const [answerRevealed, setAnswerRevealed] = useState(false)

    const getQuestions = () => {
        setQuestions(picsData)
    }

    const nextQuestion = function () {
        if (currQuestion == questions.length - 1) {
            showMessage({
                message: "סיימת את כל השאלות, כל הכבוד!",
                type: "success",
                textAlign: "right",
                duration: 3000,
                icon: "auto"
            });
            
            navigate("Study");
        } else {
            setCurrQuestion(currQuestion + 1)
            setAnswerRevealed(false);
            setTries(2);
            setGuessValue(0);
        }
    }

    useEffect(() => {
        getQuestions();
    }, []);

    const revealAnswer = function() {
        if (guessValue === questions[currQuestion]?.price) {
            showMessage({
                message: "תשובה נכונה!",
                type: "success",
                textAlign: "right",
                duration: 3000,
                icon: "auto"
            });

            setAnswerRevealed(true);
        } else {
            if (tries > 0) {
                setTries(tries - 1)
                let message = "אוי כמעט... בוא ננסה שוב, נשארו לך " + tries + " נסיונות";
                showMessage({
                    message: message,
                    type: "warning",
                    textAlign: "right",
                    duration: 3000,
                    icon: "auto"
                });
            } else {
                let message = "כל כך קרוב! התשובה הנכונה היא " + questions[currQuestion]?.price + " שקלים";
                showMessage({
                    message: message,
                    type: "danger",
                    textAlign: "right",
                    duration: 3000,
                    icon: "auto"
                });

                setAnswerRevealed(true);
            }
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center" }} center>
            <FlashMessage />
            <CustomText style={{fontSize: 40, fontWeight: "bold"}}>נחש את המחיר</CustomText>
            <CustomText style={{marginTop: 40, fontSize: 20}}>כמה לדעתך עולה...</CustomText>
            <CustomText style={{fontSize: 20, fontWeight: "bold"}}>{questions[currQuestion]?.name}?</CustomText>
            <Image source={questions[currQuestion]?.pic} style={styles.img} />
            <View style={{marginTop: 80, justifyContent: "center", alignItems: "center", width: "100%"}} center>
                <CustomText>
                ₪ {guessValue}
                </CustomText>
                <Slider minimumValue={0} maximumValue={questions[currQuestion]?.price < 10 ? 10 : 100} value={guessValue}
                        onValueChange={ value => setGuessValue(value)} step={questions[currQuestion]?.price < 10 ? 1 : 10} style={styles.slider} />
            </View>
            { !answerRevealed && <Button style={styles.button2} title="האם צדקת?" color="#6C63FC" onPress={() => revealAnswer() }></Button> }
            { answerRevealed && <Button style={styles.button2} title="שאלה הבאה" color="#6C63FC" onPress={() => nextQuestion() }></Button> }
        </View>
    );
};

export default SliderGame;

const styles = StyleSheet.create({
    img: {
      width: 190,
      height: 150,
      marginTop: 40,
      marginLeft: 7,
      borderRadius: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: 'purple'
    },
    slider: {
        width: 200
    },
    button2: {
        margin: 50
    }
  });