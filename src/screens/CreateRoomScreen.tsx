import { useAppContext } from "@/context/AppContext";
import { NavigationProp, StackActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { createRoom } from "../components/room/rooms";
import { RootStackParamList } from "../navigation/RootNavigator";

export default function CreateRoomScreen() {
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const { user, theme } = useAppContext(); 
    const { t } = useTranslation();

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert(t('common.error'), t('create_room.name_required'));
            return;
        }

        if (!user) {
            Alert.alert(t('common.error'), t('common.login_required'));
            return;
        }

        setIsLoading(true);
        try {
            const room = await createRoom(name, topic, user);
            navigation.dispatch(StackActions.replace("RoomDetail", { room }));
        } catch (e) {
            console.error(e);
            Alert.alert(t('common.error'), t('create_room.create_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const dynamicStyles = {
        container: { backgroundColor: theme.background },
        text: { color: theme.text },
        subText: { color: theme.subText },
        input: { 
            backgroundColor: theme.card, 
            color: theme.text, 
            borderColor: theme.border 
        },
        button: { backgroundColor: theme.primary }
    };

    return (
        <ScrollView style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.title, dynamicStyles.text]}>
                {t('create_room.title')} 🏢
            </Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.subText]}>
                    {t('create_room.name_label')}
                </Text>
                <TextInput
                    placeholder={t('create_room.name_placeholder')}
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={theme.subText}
                    style={[styles.input, dynamicStyles.input]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.subText]}>
                    {t('create_room.topic_label')}
                </Text>
                <TextInput
                    placeholder={t('create_room.topic_placeholder')}
                    value={topic}
                    onChangeText={setTopic}
                    placeholderTextColor={theme.subText}
                    style={[styles.input, dynamicStyles.input]}
                />
            </View>

            <TouchableOpacity
                onPress={handleCreate}
                disabled={isLoading}
                style={[
                    styles.button, 
                    dynamicStyles.button, 
                    isLoading && { backgroundColor: theme.border }
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{t('create_room.submit_btn')} 🚀</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
    inputGroup: { marginBottom: 20 },
    label: { marginBottom: 8, fontWeight: "600" },
    input: {
        padding: 16,
        borderRadius: 14,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
        marginTop: 20,
        padding: 18,
        borderRadius: 16,
        alignItems: "center",
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});