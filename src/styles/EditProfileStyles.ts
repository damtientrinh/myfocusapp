import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  avatarSection: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#e74c3c' },
  cameraIcon: { 
    position: 'absolute', 
    bottom: 5, 
    right: 5, 
    backgroundColor: '#e74c3c', 
    padding: 8, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff'
  },
  subText: { fontSize: 12, marginTop: 10, fontWeight: '500' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  input: { 
    height: 52, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    borderWidth: 1,
    fontSize: 16 
  },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { 
    flex: 1, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent' 
  },
  genderText: { fontWeight: '600', fontSize: 15 },
  saveButton: { 
    backgroundColor: '#e74c3c', 
    height: 56, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  saveText: { color: '#fff', fontSize: 17, fontWeight: 'bold' }
});