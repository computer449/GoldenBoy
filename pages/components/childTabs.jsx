import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Pages from "../index";
import AxiosInstance from "../../utils/AxiosInstance";

const Tab = createBottomTabNavigator();

export default function childTabs(props) {
  const [child, setChild] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    AxiosInstance.get("/user/_id").then((res) => {
      setUser(res.data);
      AxiosInstance.post("/child", { childId: res.data.toString() }).then((res) => {
        setChild(res.data);
      });
    });
  }, []);

  return (
    <Tab.Navigator initialRouteName="HomeChild">
      <Tab.Screen
        name="Goals"
        children={() => <Pages.Goals navigation={props.navigation} child={child} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="bullseye" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Chores"
        children={() => <Pages.Chores navigation={props.navigation} child={child} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="list-ol" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="HomeChild"
        children={() => <Pages.HomeChild navigation={props.navigation} child={child} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="home" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="childHistory"
        component={Pages.childHistory}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="history" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Study"
        children={() => <Pages.Study navigation={props.navigation} child={child} />}
        options={{
          tabBarIcon: ({ tintColor }) => <Icon name="graduation-cap" size={25} color={tintColor} />,
          activeTintColor: "#6C63FC",
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  );
}
