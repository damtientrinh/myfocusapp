import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Để cho KeyboardAvoidingView làm việc, mình không nên dùng padding quá lớn ở đây
    paddingTop: Platform.OS === 'ios' ? 10 : 5, 
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    // Giảm xuống vì Footer giờ đã chiếm không gian thực tế, không còn đè lên list
    paddingBottom: 20, 
  },

  // --- Style cho Empty Task ---
  empty_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // Dùng margin thay vì padding để đẩy nội dung xuống
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  // --- Style TaskItem ---
  itemWrapper: {
    marginVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FF5252',
    overflow: 'hidden',
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 25,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF5252',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  timeLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  // --- QUAN TRỌNG: Style cho Input & Footer ---
  footerWrapper: {
    // BỎ position: 'absolute' và bottom: 0
    width: '100%',
    paddingHorizontal: 20,
    // paddingBottom này sẽ cộng dồn với keyboardVerticalOffset trên iOS
    paddingBottom: Platform.OS === 'ios' ? 15 : 10, 
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  dateTimePreview: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  dateTimeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  dateTimeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingLeft: 15,
    paddingRight: 8,
    height: 56,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },

  // --- Toast thông báo ---
  toastContainer: {
    position: 'absolute',
    top: 60, // Đưa Toast lên đầu màn hình để không bị phím che
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 9999,
    elevation: 10,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
  }
});