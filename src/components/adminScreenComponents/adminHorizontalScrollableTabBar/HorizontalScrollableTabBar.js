import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
//COMPONENTS
import AnnouncementSection from "./AnnouncementSection";
import BlogSection from "./BlogSection";
import StudentSection from "./StudentSection";
import DashboardSection from "./DashboardSection";
import GameResult from "./GameResultSection";

// Kategoriler
const categories = [
    { id: "1", title: "Dashboard", component: DashboardSection, icon: "dashboard" },
    { id: "2", title: "Students", component: StudentSection, icon: "face" },
    { id: "3", title: "Duyurular", component: AnnouncementSection, icon: "campaign" },
    { id: "4", title: "Bloglar", component: BlogSection, icon: "rss-feed" },
    { id: "5", title: "Maçlar", component: GameResult, icon: "sports" },
];

export default function CategoryTabs() {
    const [selectedCategory, setSelectedCategory] = useState("1");

    const SelectedComponent = categories.find((page) => page.id === selectedCategory)?.component;

    return (
        <View>
            {/* Yatay scrollable kategori listesi */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryItem, selectedCategory === category.id && styles.selectedCategoryItem]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Icon name={category.icon} size={32} color="#212529" light />
                        <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>{category.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Seçilen kategorinin içeriği */}
            <View style={styles.content}>{SelectedComponent ? <SelectedComponent /> : <Text style={styles.contentText}>No content</Text>}</View>
        </View>
    );
}

// Stiller
const styles = StyleSheet.create({
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    categoryItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        height: 80,
        width: 80,
        alignItems: "center",
        justifyContent: "space-around",
    },
    selectedCategoryItem: {
        backgroundColor: "#f9bec7",
    },
    categoryText: {
        fontSize: 10,
        fontFamily: "Poppins-Light",
    },
    selectedCategoryText: {
        fontWeight: "bold",
        fontFamily: "Poppins-Medium",
    },
    content: {
        marginTop: 20,
        backgroundColor: "#f0f0f0",
    },
    contentText: {
        fontSize: 18,
    },
});
