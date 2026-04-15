import { StyleSheet } from 'react-native';
import { Spacing, Shadows } from '../../../constants/theme'; 

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
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
    width: 20,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  titleWrapper: {
    width: 120, 
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'capitalize', 
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