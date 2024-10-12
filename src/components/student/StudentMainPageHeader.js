import React from "react";
import { Text, SafeAreaView } from "react-native";
import styles from "../../styles/AppStyles";

const StudentMainPageHeader = ({ user }) => {
    return (
        <SafeAreaView style={styles.studentMainPageHeader}>
            <Text style={styles.textForFont}>
                Merhaba, {user && user.name ? user.name : "Guest"}
            </Text>
        </SafeAreaView>
    );
};

export default StudentMainPageHeader;
