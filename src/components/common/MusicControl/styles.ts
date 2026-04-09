import { StyleSheet } from 'react-native';
import { Spacing, Shadows } from '../../../constants/theme'; 

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25, 
    borderWidth: 1,
    // Hiệu ứng đổ bóng mờ ảo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  titleWrapper: {
    width: 140, // Tăng thêm một chút cho thoải mái
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'capitalize', // Tự động viết hoa chữ cái đầu cho đẹp
  },
  // Thêm một chấm nhỏ báo hiệu đang phát
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
  }
});