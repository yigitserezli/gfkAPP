import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import CreateStudents from "../screens/admin/students/CreateStudents";
import DetailStudents from "../screens/admin/students/DetailStudents";
import UpdateStudent from "../screens/admin/students/UpdateStudent";
import StudentPayment from "../screens/admin/students/StudentPayment";
import AddReportForStudent from "../screens/admin/students/AddReportForStudent";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

export default function MainNavigator() {
    const user = useSelector((state) => state.user.user);
    const currentMonth = new Date().toLocaleString("tr-TR", { month: "long" });
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? <Stack.Screen name="App" component={AppNavigator} /> : <Stack.Screen name="Auth" component={AuthNavigator} />}
                <Stack.Screen
                    name="Öğrenci Yarat"
                    component={CreateStudents}
                    options={{
                        title: "Öğrenci Yarat",
                        headerShown: true,
                        headerBackAccessibilityLabel: "Geri",
                        headerBackTitle: "Geri",
                        headerBackTitleVisible: true,
                        headerBackTitleStyle: {
                            color: "white",
                        },
                        headerStyle: {
                            backgroundColor: "#85182a",
                        },
                        headerTintColor: "white",
                    }}
                />
                <Stack.Screen
                    name="DetailStudents"
                    component={DetailStudents}
                    options={{
                        title: "Öğrenci Detayları",
                        headerShown: true,
                        headerBackAccessibilityLabel: "Geri",
                        headerBackTitle: "Geri",
                        headerBackTitleVisible: true,
                        headerBackTitleStyle: {
                            color: "white",
                        },
                        headerStyle: {
                            backgroundColor: "#85182a",
                        },
                        headerTintColor: "white",
                    }}
                />
                <Stack.Screen
                    name="UpdateStudent"
                    component={UpdateStudent}
                    options={{
                        title: "Bilgileri Güncelle",
                        headerShown: true,
                        headerBackAccessibilityLabel: "Geri",
                        headerBackTitle: "Geri",
                        headerBackTitleVisible: true,
                        headerBackTitleStyle: {
                            color: "white",
                        },
                        headerStyle: {
                            backgroundColor: "#85182a",
                        },
                        headerTintColor: "white",
                    }}
                />
                <Stack.Screen
                    name="StudentPayment"
                    component={StudentPayment}
                    options={{
                        title: "Aidat Ödeme",
                        headerShown: true,
                        headerBackAccessibilityLabel: "Geri",
                        headerBackTitle: "Geri",
                        headerBackTitleVisible: true,
                        headerBackTitleStyle: {
                            color: "white",
                        },
                        headerStyle: {
                            backgroundColor: "#85182a",
                        },
                        headerTintColor: "white",
                    }}
                />
                <Stack.Screen
                    name="Reports"
                    component={AddReportForStudent}
                    options={{
                        title: `${currentMonth} Ayı Eksik Karneler`,
                        headerShown: true,
                        headerBackAccessibilityLabel: "Geri",
                        headerBackTitle: "Geri",
                        headerBackTitleVisible: true,
                        headerBackTitleStyle: {
                            color: "white",
                        },
                        headerStyle: {
                            backgroundColor: "#85182a",
                        },
                        headerTintColor: "white",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
