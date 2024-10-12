import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/AppStyles";

const SearchBar = ({ search, setSearch, filterVisible, setFilterVisible }) => {
    return (
        <View style={styles.searchBarContainer}>
            <FontAwesome name="search" size={20} color="gray" />
            <TextInput style={styles.input} placeholder="Ara..." value={search} onChangeText={setSearch} />
            <TouchableOpacity onPress={() => setFilterVisible(!filterVisible)}>
                <FontAwesome name="filter" size={22} color="black" />
            </TouchableOpacity>
        </View>
    );
};
 export default SearchBar;