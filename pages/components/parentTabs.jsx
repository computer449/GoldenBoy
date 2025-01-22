import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Pages from "../index";
import AxiosInstance from "../../utils/AxiosInstance";

const Tab = createBottomTabNavigator();

export default function parentTabs(props) {
  const [parent, setParent] = useState("");

  useEffect(() => {
    AxiosInstance.get("/user/_id").then((res) => {
      AxiosInstance.post("/parent", { parentId: res.data.toString() }).then((res) => {
        setParent(res.data);
      });
    });
  }, []);

  return (
    <Tab.Navigator initialRouteName="HomeParent">
      <Tab.Screen
        name="Chores"
        children={() => <Pages.Chores navigation={props.navigation} parent={parent} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="list-ol" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="HomeParent"
        children={() => <Pages.HomeParent navigation={props.navigation} parent={parent} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="home" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="History"
        children={() => <Pages.History navigation={props.navigation} parent={parent} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="history" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  );
}
