import { useState } from "react";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";

const useDownloadPDF = () => {
    const [loading, setLoading] = useState(false);

    const requestFileWritePermission = async () => {
        // Sadece Android cihazlarda izin isteme işlemi yap
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: "Dosya İzni",
                message: "PDF dosyasını indirmek için dosya yazma iznine ihtiyaç var.",
                buttonNeutral: "Daha Sonra",
                buttonNegative: "İptal",
                buttonPositive: "Tamam",
            });
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Hata", "Dosya yazma izni reddedildi.");
                return false;
            }
        }
        return true;
    };

    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const downloadPDF = async (student, selectedMonth, selectedReport) => {
        try {
            setLoading(true);

            const hasPermission = await requestFileWritePermission();
            if (!hasPermission) {
                setLoading(false);
                return;
            }

            const htmlContent = `
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            color: #ced4da;
            background-color: #f5f5f5;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo {
            width: 100px;
            height: auto;
            margin-bottom: 10px;
        }

        h1,
        h2 {
            color: #d90429;
        }

        h1 {
            font-size: 24px;
            text-align: center;
            border-bottom: 2px solid #d90429;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .report-card {
            border: 2px solid #d90429;
            padding: 20px;
            border-radius: 10px;
            background-color: #d90429;
        }

        .grades-list {
            list-style-type: none;
            padding: 0;
        }

        .grades-list li {
            font-size: 18px;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            padding: 5px;
        }

        .grade-label {
            font-weight: bold;
            color: #ced4da;
        }

        .grade-value {
            color: #fff;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }

        .club-info {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
        }

        .quote {
            margin-top: 10px;
            text-align: center;
            font-style: italic;
            color: #444;
            font-size: 18px;
        }

        .ad {
            margin-top: 10px;
            text-align: center;
            background-color: #e3e3e3;
            padding: 20px;
            border-radius: 10px;
            color: #333;
        }

        .intorduction {
            color: #d90429;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Gaziemir Futbol Kulübü</h1>
        <p class="intorduction">${student.name} ${student.surname} - ${selectedMonth} Karnesi</p>
    </div>
    <div class="report-card">
        <p><strong>Hoca:</strong> ${student.coachId?.name} ${student.coachId?.surname}</p>
        <p><strong>Tarih:</strong> ${formatCreatedAt(selectedReport?.createdAt)}</p>
        <h2>Puanlar</h2>
        <ul class="grades-list">
            <li><span class="grade-label">Disiplin:</span> <span
                    class="grade-value">${selectedReport?.grades.discipline} / 5</span></li>
            <li><span class="grade-label">Takım Çalışması:</span> <span
                    class="grade-value">${selectedReport?.grades.teamwork} / 5</span></li>
            <li><span class="grade-label">Uyum:</span> <span
                    class="grade-value">${selectedReport?.grades.harmonyWithGroup} / 5</span></li>
            <li><span class="grade-label">Fiziksel Kondisyon:</span> <span
                    class="grade-value">${selectedReport?.grades.physicalCondition} / 5</span></li>
            <li><span class="grade-label">Teknik Kondisyon:</span> <span
                    class="grade-value">${selectedReport?.grades.technicalCondition} / 5</span></li>
            <li><span class="grade-label">Farkındalık:</span> <span
                    class="grade-value">${selectedReport?.grades.awareness} / 5</span></li>
            <li><span class="grade-label">Devamlılık:</span> <span
                    class="grade-value">${selectedReport?.grades.continuity} / 5</span></li>
            <li><span class="grade-label">İlgi:</span> <span class="grade-value">${selectedReport?.grades.interest} /
                    5</span></li>
        </ul>
    </div>

    <div class="quote">
        <p>"Ben sporcunun zeki, çevik ve aynı zamanda ahlaklısını severim."</p>
        <p>- Mustafa Kemal Atatürk</p>
    </div>

    <div class="ad">
        <h3>Gaziemir Futbol Kulübü'ne Katılın!</h3>
        <p>Geleceğin yıldız futbolcuları bizimle yetişiyor. Siz de çocuğunuzun gelişimi için profesyonel bir kulüpte
            eğitim almasını sağlayın.</p>
        <p>Adres: Yeşil 43/2 Sokak No:4/1, Gaziemir, İzmir, Türkiye, 35410</p>
        <p>Telefon: +90 505 958 18 24</p>
    </div>

    <div class="footer">
        <p>Bu PDF, ${new Date().getFullYear()} yılında Gaziemir Futbol Kulübü tarafından oluşturulmuştur.</p>
    </div>
</body>

</html>
`;

            const options = {
                html: htmlContent,
                fileName: `${student.name}_${selectedMonth}_Karne`,
                directory: "Documents",
            };

            const file = await RNHTMLtoPDF.convert(options);

            if (Platform.OS === "android") {
                const downloadResult = await FileSystem.downloadAsync(
                    file.filePath,
                    `${FileSystem.documentDirectory}${student.name}_${selectedMonth}_Karne.pdf`
                );
                Alert.alert("Başarılı", "PDF indirildi! " + downloadResult.uri);
            } else if (Platform.OS === "ios") {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(file.filePath);
                } else {
                    Alert.alert("Başarılı", "PDF dosyası oluşturuldu!");
                }
            }

            setLoading(false);
            return file.filePath;
        } catch (error) {
            console.error("PDF oluşturma hatası:", error);
            Alert.alert("Hata", "PDF oluşturulurken bir hata oluştu.");
            setLoading(false);
        }
    };

    return { downloadPDF, loading };
};

export default useDownloadPDF;
