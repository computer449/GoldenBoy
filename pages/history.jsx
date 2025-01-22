import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { CustomText } from "../common/CustomText";
import AxiosInstance from "../utils/AxiosInstance";
import MaterialTabs from 'react-native-material-tabs';
import { DataTable } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import Moment from 'moment';
import axios from 'axios';


const imgApprove = require("../images/approve.png");
const imgDontApprove = require("../images/dontapprove.png");
const imgWallet = require("../images/wallet.png");
const imgsmallApprove = require("../images/smallapprove.png");
const imgsmallDontApprove = require("../images/smalldontapprove.png");
const imgHistory = require("../images/history.png");

const History = (props) => {
  if (!props.parent) {
    return <></>;
  }

  const [children, setChildren] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [childTz, setChildTz] = useState("");
  const [childName, setChildName] = useState("");
  const [requestId, setRequestId] = useState("");
  const [history, setHistory] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedChildTab, setSelectedChildTab] = useState(0);


  const getChildren = () => {
    props.parent.children.forEach(child => {
      AxiosInstance.get('child', {
        params: {
          children: props.parent.children
        }
      }).then(resp => {
        setChildren(Object.values(resp.data));
      });
    });
  }


  const getLatestRequest = () => {
    AxiosInstance.get('request').then((resp) => {
      setReason(resp.data.reason);
      setAmount((resp.data.amount).toString());
      setRequestId(resp.data._id);
      setChildTz((resp.data.childId).toString());
      setShow(true)
    }).catch((err) => {

    })
  }

  const getRequestHistorybystatus = (index) => {
    AxiosInstance.get('request/allbyparentstatus/' + index).then((resp) => {
      setHistory(resp.data);
      setSelectedTab(index);
    }).catch((err) => {

    })
  }

  const getRequestHistory = () => {

    AxiosInstance.get('request/allbyparent').then((resp) => {
      setHistory(resp.data);
    }).catch((err) => {

    })
  }


  const getRequestChildName = () => {
    AxiosInstance.get('user/getUserByTz/' + { childTz }.childTz).then((resp) => {
      setChildName(resp.data.name);
    }).catch((err) => {

    })
  }

  const approveRequest = () => {
    var reqId = requestId;
    var childTzId = childTz;
    var moneyChange = Math.abs({ amount }.amount);
    axios.all([
      AxiosInstance.put('request/approve/' + reqId, { status: '1' }),
      AxiosInstance.put('child/updatemoney/' + childTzId, { money: moneyChange })
    ])
      .then((resp) => {
        setShow(!show)
        setVisibility(!visibility)
        showMessage({
          message: "הבקשה אושרה בהצלחה",
          type: "success",
          textAlign: "right",
          duration: 3000,
          icon: "auto"
        })
        // navigate("HomeChild");
      }).catch((err) => {
        setShow(!show)
        setVisibility(!visibility)
        showMessage({
          message: "לא הצלחנו לאשר את הבקשה",
          description: "קרתה תקלה.. אולי ננסה שוב מאוחר יותר?",
          type: "danger",
          textAlign: "right",
          duration: 3000,
          icon: "auto",
        });
      })
  }


  const rejectRequest = () => {
    var reqId = { requestId }.requestId;

    AxiosInstance.put('request/reject/' + reqId, { status: '2' }).then((resp) => {
      setShow(!show)
      setVisibility(!visibility)
      showMessage({
        message: "הבקשה נדחתה בהצלחה",
        type: "success",
        textAlign: "right",
        duration: 3000,
        icon: "auto"
      })
      //  navigate("HomeChild");
    }).catch((err) => {
      setShow(!show)
      setVisibility(!visibility)
      showMessage({
        message: "לא הצלחנו לדחות את הבקשה",
        description: "קרתה תקלה.. אולי ננסה שוב מאוחר יותר?",
        type: "danger",
        textAlign: "right",
        duration: 3000,
        icon: "auto",
      });
    })
  }

  useEffect(() => {
    getChildren();
    getLatestRequest();
    getRequestChildName();
    getRequestHistory();
  }, [show]);

  return (<View>{show ? (
    <View style={styles.view}>
      <CustomText style={styles.headline}>
        {childName} מבקש לקבל
        </CustomText>
      <CustomText style={styles.money}>
        {amount}
        <CustomText style={styles.moneytype}>
          ש"ח
        </CustomText>
      </CustomText>
      <CustomText style={styles.headline}>
        בשביל:
        </CustomText>
      <CustomText style={styles.value}>
        {reason}
      </CustomText>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={() => { rejectRequest() }}>
          <Image source={imgDontApprove} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { approveRequest() }}>
          <Image source={imgApprove} />
        </TouchableOpacity>
      </View>
      <Image
        source={imgWallet}
        style={styles.imgWallet} />
    </View>
  ) : (
    //TODO: seperate it to components
    <View>
      <View style={{ alignItems: "center" }}>
        <CustomText style={styles.historyheadline}>
          היסטורית הבקשות שלי</CustomText>
      </View>
      <SafeAreaView style={styles.container}>
        <MaterialTabs
          items={['הכל', 'אושרו', 'נדחו']}
          selectedIndex={selectedTab}
          onChange={getRequestHistorybystatus}
          barColor="#a89af5"
          indicatorColor="#6A2C70"
          activeTextColor="black"
          textStyle={{ fontSize: 16, fontFamily: 'VarelaRound' }}
        />
      </SafeAreaView>
      <View style={styles.secondfilter}>
        <SafeAreaView style={styles.container}>
          <MaterialTabs
            items={children != "" ? children.map((item, key) => ((item.user.name))) : [' ']}
            selectedIndex={selectedChildTab}
            onChange={getChildren}
            barColor="#6C63FF"
            indicatorColor="#6A2C70"
            activeTextColor="black"
            textStyle={{ fontSize: 16, fontFamily: 'VarelaRound' }}
          />
        </SafeAreaView>
      </View>
      <ScrollView style={styles.table}>
        <DataTable>


          <FlatList
         data={history && history.sort((a, b) => a.dateRequested.localeCompare(b.dateRequested)).reverse()}
            renderItem={({ item }) => {
              return <DataTable.Row>
                <DataTable.Cell style={{ flex: 2 }}><CustomText style={styles.date}>{item.amount}</CustomText></DataTable.Cell>
                <DataTable.Cell style={{ flex: 3 }}> <CustomText style={styles.tablevalue}>{item.reason}</CustomText> </DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}><CustomText style={styles.date}>{Moment(item.dateRequested).format("DD/MM/YY")}</CustomText></DataTable.Cell>
                <DataTable.Cell><Image source={item.status == 1 ? imgsmallApprove : imgsmallDontApprove} /></DataTable.Cell>
              </DataTable.Row>
            }}
            keyExtractor={historyitem => historyitem._id}
          />

        </DataTable>
      </ScrollView>
      <Image
        source={imgHistory}
        style={styles.imgHistory} />
    </View>


  )}
  </View>
  );
};

export default History;

const styles = StyleSheet.create({
  headline: {
    fontSize: 30,
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
    fontSize: 60,
    marginTop: 10
  },
  moneytype: {
    alignItems: "center",
    fontSize: 18,
    marginRight: 5
  },
  imgApprove: {
    marginTop: 35,
    marginRight: 180,
  },
  imgDontApprove: {
    marginLeft: 180,
  },
  button: {
    marginTop: 40,
    margin: 60,
  },
  imgWallet: {
    width: 200,
    height: 178,
    marginTop: 180,
  },
  secondfilter: {
    marginTop: 25,
  },
  historyheadline: {
    fontSize: 30,
    marginTop: 80,
    color: '#6A2C70'
  },
  tablevalue: {
    fontSize: 19,
    color: '#020000'
  },
  container: {
    marginTop: 20,
    flex: 1,
  },
  table: {
    height: 300,
    marginTop: 60,
    marginLeft: 40
  },
  date: {
    alignItems: "center",
    fontSize: 15
  },
  imgHistory: {
    marginTop: 550,
    marginLeft: 40,
    position: 'absolute'
  },
})
