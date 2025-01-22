import React, { useState, useEffect } from 'react';
import { StyleSheet,ScrollView, View, Image, TextInput, TouchableOpacity,SafeAreaView,FlatList} from "react-native";
import { CustomText } from "../common/CustomText";
import MaterialTabs from 'react-native-material-tabs';
import { DataTable } from 'react-native-paper';
import AxiosInstance from "../utils/AxiosInstance";
import Moment from 'moment';
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import axios from 'axios';

const imgApprove = require("../images/smallapprove.png");
const imgDontApprove = require("../images/smalldontapprove.png");
const imgHistory = require("../images/history.png");

const childHistory = ({navigation: { navigate }}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [history, setHistory] = useState("");

    const getRequestHistorybystatus = (index) => {
      AxiosInstance.get('request/allbychildstatus/' +index).then((resp) => {
        setHistory(resp.data);
        setSelectedTab(index);
      }).catch((err) => {
        
      })
    }

    const getRequestHistory = () => {
      AxiosInstance.get('request/allbychild').then((resp) => {
        setHistory(resp.data);
      }).catch((err) => {
        
      })
    }
   
    useEffect(() => {
      getRequestHistory();
    },[]);
  return (
    <View>
        <View style={styles.view}>
<CustomText style={styles.headline}>
             היסטורית הבקשות שלי</CustomText>
             </View>
    <SafeAreaView style={styles.container}>
    <MaterialTabs
    items={['הכל','אושרו','נדחו']}
    selectedIndex={selectedTab}
    onChange={getRequestHistorybystatus}
    barColor="#a89af5"
    indicatorColor="#6A2C70"
    activeTextColor="black"
    textStyle={{fontSize: 16,fontFamily: 'VarelaRound'}}
  />
    </SafeAreaView>
    <ScrollView style={styles.table}>
    <DataTable>

    <FlatList
         data={history && history.sort((a, b) => a.dateRequested.localeCompare(b.dateRequested)).reverse()}
        renderItem={({ item }) => {
          return <DataTable.Row>
          <DataTable.Cell style={{flex: 2}}><CustomText style={styles.date}>{item.amount}</CustomText></DataTable.Cell>
          <DataTable.Cell style={{flex: 3}}> <CustomText style={styles.tablevalue}>{item.reason}</CustomText> </DataTable.Cell>
          <DataTable.Cell style={{flex: 2}}><CustomText style={styles.date}>{Moment(item.dateRequested).format("DD/MM/YY")}</CustomText></DataTable.Cell> 
          <DataTable.Cell><Image source={item.status==1 ? imgApprove : imgDontApprove}/></DataTable.Cell>
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
  );
};

export default childHistory;

const styles = StyleSheet.create({
  headline: {
 fontSize: 30,
    marginTop: 80,
    color:'#6A2C70'
  },
  value: {
    fontSize: 19,
    color:'#020000'
  },
  view: {
    alignItems: "center"
  },
  container: {
    marginTop: 20,
    flex: 1,
  },
  table: {
      height:330,
    marginTop: 60,
    marginLeft: 40
  },
  date: {
    alignItems: "center",
    fontSize: 15
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
  imgHistory: {
    marginTop: 550,
    marginLeft:40,
    position:'absolute'
  },
})
