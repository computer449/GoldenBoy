import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";
import NavContainer from "./pages/components/NavContainer";
import { LogBox } from "react-native";

// Ignore log notification by message
// LogBox.ignoreLogs([
//   "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead",
// ]);
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavContainer />
      <FlashMessage position="bottom" floating={true} />
    </View>
  );
}
