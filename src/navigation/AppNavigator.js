import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../screens/admin/main/MainScreen";
import SettingScreen from "../screens/admin/settings/SettingScreen";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Anasayfa") {
                        iconName = "home";
                    } else if (route.name === "Dashboard") {
                        iconName = "dashboard";
                    } else if (route.name === "Ayarlar") {
                        iconName = "settings";
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: "#bdbdbd",
                tabBarStyle: {
                    backgroundColor: "#85182a",
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "Poppins-SemiBold",
                },
                tabBarHideOnKeyboard: true,
                tabBarVisibilityAnimationConfig: {
                    delay: 500,
                    duration: 600,
                    easing: "ease-in-out",
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={MainScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Ayarlar"
                component={SettingScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}
