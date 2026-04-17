import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f6fa",
    },
    joinSection: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingHorizontal: 15,
        alignItems: "center",
        height: 50,
        // Shadow cho iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Shadow cho Android
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#2f3640',
    },
    joinText: {
        color: "#4CAF50",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 10,
    },
    roomCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50', // Màu nhấn cho phòng
    },
    roomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    roomName: {
        fontSize: 18,
        fontWeight: "800",
        color: '#2f3640',
        marginBottom: 4,
    },
    roomTopic: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 10,
    },
    roomFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#f1f2f6',
    },
    memberCount: {
        fontSize: 14,
        color: '#2ecc71',
        fontWeight: '600',
    },
    deleteBtn: {
        paddingVertical: 5,
    },
    deleteText: {
        color: "#e74c3c",
        fontWeight: "600",
        fontSize: 13,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#95a5a6',
        fontStyle: 'italic',
    }
});