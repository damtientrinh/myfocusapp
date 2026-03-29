import { StyleSheet, Platform } from 'react-native';

// Trình định nghĩa các kiểu chữ và khoảng cách dùng chung ở đây
export const globalStyles = (theme: any) => StyleSheet.create({
  // Container chính cho mọi màn hình
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  
  // Các kiểu chữ tiêu chuẩn để cả nhóm viết cho đồng bộ
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 15,
    color: theme.subText,
    lineHeight: 22,
  },

  // Style cho các chiếc Card (ô nội dung)
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.border,
    // Đổ bóng nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Button dùng chung (Màu cam/đỏ đặc trưng của Trình)
  primaryButton: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});