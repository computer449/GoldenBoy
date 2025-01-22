import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, TextInput, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { CustomText } from "../common/CustomText";
import { Button } from "../common/Button";
import AxiosInstance from "../utils/AxiosInstance";
const imgGoal = require("../assets/images/goal.png");
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts';


const ChildView = (props) => {
    let child = props.route.params.child;
    const [money, setMoney] = useState(child.child.allowance ? child.child.allowance.money : "");
    const [selectedDay, setSelectedDay] = useState(child.child.allowance ? child.child.allowance.day : "ראשון");
    const [frequency, setFrequency] = useState(child.child.allowance ? child.child.allowance.frequency : "יום");
    const [shouldOpenMoneyDialog, setShouldOpenMoneyDialog] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [graph, setGraph] = useState();

    if (!props.route.params.parent) {
        return <></>;
    }
    

    const [goalDescription, setGoalDescription] = useState("");
    const [goalAmount, setGoalAmount] = useState("");

    const getLatestGoal = () => {
        AxiosInstance.get('goals/byChild', {
            params: {
                childId: child.child._id
            }
        }).then((resp) => {
            setGoalDescription(resp.data.description);
            setGoalAmount(resp.data.amount);
        })
    }

    const getInfoForGraph = () => {
        AxiosInstance.get('moneyHistory/monthly', {
            params: {
                childId: child.user._id
            }
        }).then((resp) => {
            let wgraphData = resp.data.map(item => item.amount);
            let xGraphData = resp.data;
            setGraph(<View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={wgraphData}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={wgraphData}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid />
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={xGraphData}
                        formatLabel={(value, index) => { return xGraphData[index].date + 1 }}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                    />
                </View>
            </View>);
        })
    }

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30

    const handleAddAllowance = () => {
        console.log(child);
        AxiosInstance.put("child/addAllowance/" + child.user.idNumber,
            { allowance: { money: money, day: selectedDay, frequency: frequency } }).
            then(response => {
                setShouldOpenMoneyDialog(false);
                showMessage({
                    message: "הכסף הוסף בהצלחה",
                    type: "success",
                    textAlign: "right",
                    duration: 3000,
                    icon: "auto"
                });
            }).catch(err => console.log(err));
    }


    useEffect(() => {
        getLatestGoal();
        getInfoForGraph();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <FlashMessage />
            <CustomText style={styles.headline}>
                החיסכון של {child.user.name}
            </CustomText>
            <CustomText style={styles.money}>
                {child.child.money + " "}
                <CustomText style={styles.moneytype}>
                    ש"ח
            </CustomText>
            </CustomText>
            <Image source={imgGoal}></Image>
            <CustomText style={styles.minorHeadline}>
                {goalDescription ? goalDescription : "לא הוגדרה מטרה"}
            </CustomText>
            <CustomText style={styles.value}>
                <CustomText style={styles.moneytype}>
                    {goalAmount ? goalAmount + ' ש"ח' : null}
                </CustomText>
            </CustomText>
            <CustomText style={styles.smallHeadline}>
                דמי כיס
            </CustomText>
            <CustomText>
                {child.child.allowance ? child.child.allowance.money + 'ש"ח כל ' + child.child.allowance.frequency + ' ביום ' + child.child.allowance.day : "אין"}
            </CustomText>
            <View style={styles.modalButton}>
                <Button onPress={() => { setShouldOpenMoneyDialog(!shouldOpenMoneyDialog) }} title="עדכן דמי כיס" />
            </View>
            <CustomText style={styles.smallHeadline}>
                גרף התקדמות
            </CustomText>
            {graph}
            <Modal
                transparent={true}
                animationType={"slide"}
                visible={shouldOpenMoneyDialog}
                onRequestClose={() => { setShouldOpenMoneyDialog(!shouldOpenMoneyDialog) }}
                onBackdropPress={() => { setShouldOpenMoneyDialog(!shouldOpenMoneyDialog) }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.ModalInsideView}>
                        <CustomText style={styles.headline}>סכום דמי הכיס</CustomText>
                        <View styles={styles.moneyInput}>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.input}
                                value={money}
                                onChangeText={(money) => setMoney(money)}
                            />
                            <CustomText style={{ position: 'relative', bottom: 20 }}>ש"ח</CustomText>
                        </View>
                        <View style={{ flexDirection: "row", zIndex: 10 }}>
                            <DropDownPicker
                                defaultValue={selectedDay}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                containerStyle={{ height: 40, width: 120, marginRight: 20 }}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                items={[{ label: 'ראשון', value: "ראשון", selected: true },
                                { label: 'שני', value: "שני" },
                                { label: 'שלישי', value: "שלישי" },
                                { label: 'רביעי', value: "רביעי" },
                                { label: 'חמישי', value: "חמישי" },
                                { label: 'שישי', value: "שישי" },
                                { label: 'שבת', value: "שבת" }]}
                                setValue={item => setSelectedDay(item)} />
                            <CustomText>בימי</CustomText>
                        </View>
                        <View style={{ flexDirection: "row", zIndex: 9 }}>
                            <DropDownPicker
                                defaultValue={frequency}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                containerStyle={{ height: 40, width: 120, marginRight: 20, marginTop: 10 }}
                                items={[{ label: 'יום', value: "יום", selected: true },
                                { label: 'שבוע', value: "שבוע" },
                                { label: 'חודש', value: "חודש" }]}
                                setValue={item => setFrequency(item)} />
                            <CustomText style={{ marginTop: 10 }}> בכל</CustomText>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.modalButton}>
                                <Button color="#6C63FC" title="ביטול" onPress={() => setShouldOpenMoneyDialog(!shouldOpenMoneyDialog)} />
                            </View>
                            <View style={styles.modalButton}>
                                <Button color="#6C63FC" title="שמירה" onPress={handleAddAllowance} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default ChildView;
const styles = StyleSheet.create({
    ModalInsideView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        height: 350,
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
    headline: {
        marginBottom: 20,
        fontSize: 30,
        color: "#3A23CD"
    },
    modalHeadline: {
        marginBottom: 50,
        fontSize: 30,
        color: "#3A23CD"
    },
    input: {
        textAlign: "center",
        borderBottomWidth: 1.0,
        width: 200,
        fontSize: 17,
        position: 'relative',
        bottom: 20
    },
    smallHeadline: {
        fontSize: 20,
        marginTop: 15,
        color: '#6A2C70',
        fontWeight: "bold"
    },
    minorHeadline: {
        fontSize: 20,
        marginTop: 15,
        color: '#6A2C70'
    },
    date: {
        alignItems: "center",
        fontSize: 15
    },
    moneyInput: {
        flexDirection: 'row'
    },
    modalButton: {
        width: 100,
        marginTop: 30,
        marginLeft: 16,
        marginRight: 16
    },
    money: {
        alignItems: "center",
        fontSize: 30,
        marginTop: 10
    },
});