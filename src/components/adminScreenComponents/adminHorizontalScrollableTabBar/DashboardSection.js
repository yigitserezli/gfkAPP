import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
//ICONS
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";
import AntIcon from "react-native-vector-icons/AntDesign";
//HOOKS
import useCurrentMonthName from "../../../hooks/useGetThisMonth";
import useStatistic from "../../../hooks/useStatistic";
import useGetStudentReports from "../../../hooks/useGetStudentReports";
//NAVIGATION
import { useNavigation } from "@react-navigation/native";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setDashboardRefresh } from "../../../redux/slices/refreshSlice";
//TOAST
import { showInfoToast } from "../../../components/ToastMessages";

const { width } = Dimensions.get("window");

export default function DashboardSection() {
    //HOOKS
    const currentMonthName = useCurrentMonthName();
    const { statistics, loading: statisticLoading, error } = useStatistic();
    const { studentsWithoutReport, fetchStudentsWithoutReportForCurrentMonth, loading: reportLoading } = useGetStudentReports();
    //NAVIGATION
    const navigation = useNavigation();
    //REDUX
    const dispatch = useDispatch();
    const refresh = useSelector((state) => state.refresh.dashboard);

    useEffect(() => {
        if (refresh) {
            fetchStudentsWithoutReportForCurrentMonth();
            dispatch(setDashboardRefresh(false));
        }
    }, [refresh, dispatch]);

    const isLoading = statisticLoading || reportLoading;
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#85182a" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Bir hata oluştu: {error.message}</Text>
            </View>
        );
    }

    const Item = ({ item }) => {
        return (
            <View style={styles.studentCard}>
                <Image source={{ uri: "https://avatar.iran.liara.run/public" }} style={styles.studentImage} />
                <Text style={styles.studentName}>{truncateName(item.name)}</Text>
                <Text style={styles.studentName}>{truncateName(item.surname)}</Text>
            </View>
        );
    };

    const truncateName = (name) => {
        const maxLength = 7;
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    return (
        <View>
            <View style={{ flexDirection: "row", alignSelf: "flex-end", marginBottom: 10, marginRight: 20, gap: 5 }}>
                <Text style={{ fontFamily: "Poppins", alignSelf: "flex-end", color: "gray" }}>Kaydır</Text>
                <Icon name="arrow-forward" size={20} color="gray" style={{ alignSelf: "center" }} />
            </View>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.textHead}>Anlık Altyapı Durumu</Text>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="group" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>Toplam Kayıtlı Öğrenci:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.totalStudents}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="person-add" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>Son 30 Günde Kayıt Olmuş:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.studentsInLast30Days}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="person-off" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>Son 6 Ayda Pasife Düşen:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.inactiveStudentsInLast6Months || 0}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="leaderboard" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>En Kalabalık Yaş Grubu:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.mostCrowdedAgeCategory}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="low-priority" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>En Seyrek Yaş Grubu:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.lowestCrowdedAgeCategory}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.textHead}>{currentMonthName} Ayı Finansal Durum</Text>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <FontAwesome name="try" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>Beklenen Aylık Aidat Geliri:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.expectedIncome}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="check-circle" color="green" size={20} />
                                <Text style={styles.regularText}>Ödeme Yapmış Öğrenci:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.alreadyPaidStudents}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="remove-circle" color="#ff477e" size={20} />
                                <Text style={styles.regularText}>Ödemesi Eksik Öğrenci:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.notPayYetStudents}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="monetization-on" color="green" size={20} />
                                <Text style={styles.regularText}>Toplanan Anlık Tutar:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.totalIncome}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="error" color="#ff477e" size={20} />
                                <Text style={styles.regularText}>Toplanmamış Anlık Tutar:</Text>
                            </View>
                            <Text style={styles.regularText}>{statistics.willBeTakenIncome}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.textHead}>Anlık Altyapı Durumu</Text>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="groups" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>Toplam Kayıtlı Kullanıcı:</Text>
                            </View>
                            <Text style={styles.regularText}> #soon#</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="how-to-reg" color="green" size={20} />
                                <Text style={styles.regularText}>Bugün Aktif Olan Kişi:</Text>
                            </View>
                            <Text style={styles.regularText}> #soon#</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="access-time" color="#ff477e" size={20} />
                                <Text style={styles.regularText}>Son 30 Gün Giriş Yapmayan:</Text>
                            </View>
                            <Text style={styles.regularText}> #soon#</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="pending" color="#ced4da" size={20} />
                                <Text style={styles.regularText}>Onay Bekleyen Blog Yazıları:</Text>
                            </View>
                            <Text style={styles.regularText}> #soon#</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Icon name="support-agent" color="yellow" size={20} />
                                <Text style={styles.regularText}>Toplam Gelen Ticket Sayısı:</Text>
                            </View>
                            <Text style={styles.regularText}> #soon#</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.studentReportCard}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, justifyContent: "space-between" }}>
                    <Text style={styles.textHeadOpposite}>Eksik Karneler - {currentMonthName}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Reports")} style={{ flexDirection: "row", gap: 5 }}>
                        <Text style={{ fontFamily: "Poppins", alignSelf: "center", color: "gray", fontSize: 16 }}>Git</Text>
                        <AntIcon name="arrowright" size={25} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* FlatList with horizontal scroll */}
                <FlatList
                    horizontal
                    data={studentsWithoutReport}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    windowSize={5} //Pencere basina 5 ogrenci goster
                    initialNumToRender={10} //Ilk acildiginda 10 ogrenci goster
                    onEndReachedThreshold={0.5} //Scrollun %50'ye gelince yeni ogrencileri yukle
                    maxToRenderPerBatch={10} //10'ar 10'ar ogrenci yukle
                    updateCellsBatchingPeriod={50} //50ms'de bir ogrencileri yukle
                    removeClippedSubviews={true} //Gorunmeyen ogrencileri kaldır
                    contentContainerStyle={{ marginHorizontal: 20 }}
                />
            </View>
            <View style={styles.lastTickets}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={styles.textHeadOpposite}>Son Destek Talepleri</Text>
                    <TouchableOpacity onPress={() => showInfoToast("Ne yazıkki şu an ticket sistemi aktif değildir 🥺")} style={{ flexDirection: "row", gap: 5 }}>
                        <Text style={{ fontFamily: "Poppins", alignSelf: "center", color: "gray", fontSize: 16 }}>Git</Text>
                        <AntIcon name="arrowright" size={25} color="gray" />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: "Poppins", paddingHorizontal: 10, marginTop: 10 }}>Destek talepleri yakında hizmete girecektir.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        alignItems: "center",
    },
    card: {
        width: width * 0.9,
        height: 200,
        backgroundColor: "#85182a",
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    studentReportCard: {
        width: width,
    },
    textHead: {
        color: "white",
        fontSize: 16,
        fontFamily: "Poppins",
        padding: 10,
        textDecorationColor: "white",
        textDecorationLine: "underline",
    },
    textHeadOpposite: {
        color: "#85182a",
        fontSize: 18,
        fontFamily: "Poppins-Regular",
        padding: 10,
        alignSelf: "flex-start",
    },
    regularText: {
        color: "#ced4da",
        fontSize: 14,
        fontFamily: "Poppins",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 10,
        gap: 5,
        width: "80%",
        marginVertical: 5,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    studentCard: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    studentImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: "#ced4da",
        marginBottom: 5,
    },
    studentName: {
        fontSize: 14,
        fontFamily: "Poppins",
        color: "#333",
    },
    lastTickets: {
        width: width,
        height: 200,
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 20,
    },
});
