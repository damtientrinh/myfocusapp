import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import CreateRoomScreen from "@/screens/CreateRoomScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            {/* Main App */}
            <Stack.Screen
                name="Main"
                component={TabNavigator}
                options={{ headerShown: false }}
            />

            {/* Create Room */}
            <Stack.Screen
                name="CreateRoom"
                component={CreateRoomScreen}
                options={{ title: "Tạo phòng" }}
            />
        </Stack.Navigator>
    );
}