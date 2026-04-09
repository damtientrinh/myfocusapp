import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Spacing, Fonts, FontWeight, Shadows } from '../constants/theme'; 

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // 1. Container chính của màn hình Focus
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },

  // 3. Vòng tròn đồng hồ (Timer Circle)
  circleContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerCircle: {
    width: '90%',
    height: '90%',
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    position: 'absolute',
  },
  timeText: {
    fontSize: 80,
    color: '#FFF',
    fontFamily: Fonts.mono, 
    fontWeight: FontWeight.semiBold,
    fontVariant: ['tabular-nums'],
  },

  // 4. Hàng nút điều khiển (Start/Reset)
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30, 
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    // Đổ bóng cho nút (Shadow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: FontWeight.medium,
    letterSpacing: 1, 
    textTransform: 'uppercase', 
  },

  // 5. Khu vực Task đang chọn (Task Info Area)
  taskInfoArea: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 40,
  },
  activeTaskBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: Spacing.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',
  },
  activeTaskText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
    fontWeight: '600',
  },
  finishTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Spacing.borderRadius.full,
    gap: 8,
    marginTop: 4,
  },

  
});