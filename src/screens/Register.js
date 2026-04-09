import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp");
            return;
        }
        alert("Đăng ký thành công với email: " + email);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🍅</Text>
            <Text style={styles.appName}>Pomodo</Text>

            <View style={styles.card}>
                <Text style={styles.title}>Đăng ký tài khoản</Text>

                <TextInput
                    placeholder="Nhập email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Nhập mật khẩu"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TextInput
                    placeholder="Xác nhận mật khẩu"
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f8",
        justifyContent: "center",
        padding: 20
    },

    logo: {
        fontSize: 60,
        textAlign: "center"
    },

    appName: {
        fontSize: 22,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20
    },

    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#fafafa"
    },

    button: {
        backgroundColor: "#ff6347",
        padding: 15,
        borderRadius: 10,
        marginTop: 5
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    }
});