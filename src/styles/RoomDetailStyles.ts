import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    roomName: {
        fontSize: 22, 
        fontWeight: "bold",
    },
    roomTopic: { 
        fontSize: 14,
        marginTop: 2
    },
    roomCode: { 
        marginTop: 8,
        fontWeight: '700',
        fontSize: 15
    },
    focusBtn: {
        margin: 16,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    focusBtnText: { 
        color: "#fff", 
        fontWeight: "bold",
        fontSize: 14,
        marginLeft: 8
    },
    sectionTitle: { 
        fontWeight: "bold", 
        marginBottom: 12,
        fontSize: 16,
    },
    // Style mới cho danh sách thành viên nằm ngang
    memberBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatList: { 
        flex: 1, 
        marginTop: 10
    },
    inputContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    },
    input: {
        flex: 1,
        borderRadius: 22,
        paddingHorizontal: 16,
        height: 45,
        marginRight: 10,
        fontSize: 15
    },
    sendBtn: {
        paddingHorizontal: 5
    },
    sendText: { 
        fontWeight: 'bold',
        fontSize: 16
    },
    leaveBtn: {
        paddingVertical: 12,
        marginBottom: Platform.OS === 'ios' ? 10 : 0
    },
    leaveText: {
        textAlign: "center",
        fontWeight: '600',
        fontSize: 14
    }
});