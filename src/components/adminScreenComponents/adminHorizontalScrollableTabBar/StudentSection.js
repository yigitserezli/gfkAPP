import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ActivityIndicator, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CheckBox } from "react-native-elements";
import { ENUMS } from "../../../constants/enum";
import styles from "../../../styles/AppStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
// COMPONENTS
import SearchBar from "../../SearchBar";
import StudentList from "../../student/StudentListComponent";
// HOOKS
import useStudent from "../../../hooks/useStudent";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setStudentRefresh } from "../../../redux/slices/refreshSlice";

export default function StudentSection() {
    const [search, setSearch] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const { students, loading, fetchStudents } = useStudent();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const refresh = useSelector((state) => state.refresh.student);

    const categories = [
        ENUMS.STUDENT_CATEGORIES.Miniminik,
        ENUMS.STUDENT_CATEGORIES.U10,
        ENUMS.STUDENT_CATEGORIES.U11,
        ENUMS.STUDENT_CATEGORIES.U12,
        ENUMS.STUDENT_CATEGORIES.U13,
        ENUMS.STUDENT_CATEGORIES.U14,
        ENUMS.STUDENT_CATEGORIES.U15,
        ENUMS.STUDENT_CATEGORIES.U16,
        ENUMS.STUDENT_CATEGORIES.U17,
        ENUMS.STUDENT_CATEGORIES.U18,
        ENUMS.STUDENT_CATEGORIES.U19,
        ENUMS.STUDENT_CATEGORIES.Amatör,
    ];

    useEffect(() => {
        if (refresh) {
            fetchStudents();
            dispatch(setStudentRefresh(false));
        }
    }, [refresh, dispatch]);

    const filteredData = students.filter(
        (item) =>
            (selectedFilters.length === 0 || selectedFilters.includes(item.ageCategory)) && item.name?.toLowerCase().includes(search.toLowerCase())
    );

    const toggleFilter = (category) => {
        setSelectedFilters((prevSelectedFilters) => {
            const updatedFilters = prevSelectedFilters.includes(category)
                ? prevSelectedFilters.filter((filter) => filter !== category)
                : [...prevSelectedFilters, category];
            return updatedFilters;
        });
    };

    if (loading) {
        return (
            <SafeAreaView>
                <ActivityIndicator size="large" color="red" />
            </SafeAreaView>
        );
    }

    const chunkedCategories = [];
    for (let i = 0; i < categories.length; i += 3) {
        chunkedCategories.push(categories.slice(i, i + 3));
    }

    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <SearchBar search={search} setSearch={setSearch} filterVisible={filterVisible} setFilterVisible={setFilterVisible} />
                <TouchableOpacity onPress={() => navigation.navigate("Öğrenci Yarat")}>
                    <Icon name="add-circle" size={48} color={"#50C878"} style={{ paddingRight: 10 }} />
                </TouchableOpacity>
            </View>

            {filterVisible &&
                chunkedCategories.map((categoryGroup, index) => (
                    <View key={index} style={styles.checkboxRow}>
                        {categoryGroup.map((category) => (
                            <CheckBox
                                key={category}
                                title={category}
                                checked={selectedFilters.includes(category)}
                                onPress={() => toggleFilter(category)}
                                containerStyle={styles.checkboxContainer}
                                textStyle={{ fontFamily: "Poppins-Medium", fontSize: 12 }}
                                checkedColor="#85182a"
                            />
                        ))}
                    </View>
                ))}

            {/* Header */}
            <View style={styles2.headerRow}>
                <View style={styles2.name}>
                    <Text style={styles2.headerText} numberOfLines={1} ellipsizeMode="tail">
                        Öğrenci Ad Soyad
                    </Text>
                </View>
                <View style={styles2.ageCategory}>
                    <Text style={styles2.headerText} numberOfLines={1} ellipsizeMode="tail">
                        Grubu
                    </Text>
                </View>
                <View style={styles2.phone}>
                    <Text style={styles2.headerText} numberOfLines={1} ellipsizeMode="tail">
                        Cep Telefonu
                    </Text>
                </View>
            </View>
            <StudentList students={filteredData} />
        </View>
    );
}

const styles2 = {
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    headerText: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        textDecorationLine: "underline",
    },
    name: {
        flex: 3,
    },
    ageCategory: {
        flex: 1,
        textAlign: "center",
    },
    phone: {
        flex: 2,
        alignItems: "flex-end",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
};
