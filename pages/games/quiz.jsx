import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { CustomText } from "../../common/CustomText";
import { CheckBox } from 'react-native-elements'
import { Button } from "../../common/Button";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AxiosInstance from "../../utils/AxiosInstance";


const Quiz = ({ navigation: { navigate } }) => {
    const [questions, setQuestions] = useState("");
    const [currQuestion, setCurrQuestion] = useState(0)
    const [correctAnswer, setCorrectAnswers] = useState(false)
    const [selectedId, setSelectedId] = useState();
    const [prevSelected, setPrevSelected] = useState([]);

    const getQuestions = () => {
        AxiosInstance.get('/game/quiz').then((resp) => {
            setQuestions(resp.data);
        })
    }

    const nextQuestion = function () {
        if (currQuestion == questions.length - 1) {
            showMessage({
                message: "סיימת את כל השאלות בהצלחה!",
                type: "success",
                textAlign: "right",
                duration: 3000,
                icon: "auto"
            });

            navigate("Study");
        } else {
            setCurrQuestion(currQuestion + 1)
            setCorrectAnswers(false);
            setPrevSelected([]);
            setSelectedId();
        }
    }

    useEffect(() => {
        getQuestions();
    }, []);

    const handleSelection = function (index) {
        setSelectedId(index);
        if (index === questions[currQuestion]?.correct - 1) {
            setCorrectAnswers(true);
        }
        setPrevSelected([...prevSelected, index]);
    }

    const mappedAnswers = questions[currQuestion]?.answers.map((answer, index) => {
        return (
            <CheckBox style={{ textAlign: "center", width: "100%" }}
                center
                key={index}
                title={answer}
                checkedIcon=""
                uncheckedIcon=""
                checked={selectedId || false}
                containerStyle={(selectedId && selectedId == index || prevSelected.includes(index)) ? { backgroundColor: (index === questions[currQuestion]?.correct - 1) ? 'lightgreen' : 'pink' } : null}
                onPress={() => handleSelection(index)}
            />
        )
    });

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center", alignText: "center" }} center>
            <FlashMessage />
            <CustomText style={{ margin: 30, fontSize: 30, fontWeight: "bold" }}>משחק טריוויה</CustomText>
            <CustomText style={{ margin: 5, fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{questions[currQuestion]?.question}</CustomText>
            <View style={{ marginTop: 80, justifyContent: "center", alignItems: "center", minWidth: 350, maxWidth: 350 }} center>
                {mappedAnswers}
            </View>
            { correctAnswer && <Button title="שאלה הבאה" color="#6C63FC" onPress={() => nextQuestion()}></Button>}
        </View>
    );
};

export default Quiz;