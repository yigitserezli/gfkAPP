import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, FlatList } from "react-native";
import { MaterialIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

const StudentList = ({ students }) => {
    const navigation = useNavigation();

    const handleCall = (phone) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        }
    };

    const formatName = (name, surname) => {
        const fullName = `${name} ${surname}`;
        if (fullName.length > 19) {
            return `${fullName.substring(0, 18)}...`;
        }
        return fullName;
    };

    const goToDetail = (student) => {
        navigation.navigate("DetailStudents", { student });
    };

    return (
        <FlatList
            data={students}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={true}
            keyExtractor={(item) => item._id.toString()} // Her öğenin benzersiz anahtarını belirtir
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.row} onPress={() => goToDetail(item)}>
                    {/* Ad Soyad - Flex 3 */}
                    <View style={styles.nameContainer}>
                        <Text style={[styles.text, styles.name]} numberOfLines={1} ellipsizeMode="tail">
                            {formatName(item.name, item.surname)}
                        </Text>
                    </View>

                    {/* Yaş Grubu - Flex 1 */}
                    <View style={styles.ageContainer}>
                        <Text style={[styles.text, styles.ageCategory]} numberOfLines={1} ellipsizeMode="tail">
                            {item.ageCategory}
                        </Text>
                    </View>

                    {/* Cep Telefonu - Flex 2 */}
                    <TouchableOpacity onPress={() => handleCall(item.phone)} style={styles.phoneContainer}>
                        <Text style={[styles.text, styles.phone]} numberOfLines={1} ellipsizeMode="tail">
                            {item.phone ? item.phone : "Telefon Yok"}
                        </Text>
                        <MaterialIcons name="phone" size={20} color="#4361ee" style={styles.phoneIcon} />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    row: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontFamily: "Poppins",
        fontSize: 12,
    },
    nameContainer: {
        flex: 3,
    },
    ageContainer: {
        flex: 1,
    },
    phoneContainer: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    phone: {
        color: "#4361ee",
        textDecorationLine: "underline",
    },
    phoneIcon: {
        marginLeft: 5,
    },
});

export default StudentList;
