import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Spacing, Fonts } from '../constants/theme'; 

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

  // 2. Mode Selector (Thanh trượt chọn Work/Break)
  modeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.15)', 
    borderRadius: 25,
    height: 50,
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: Spacing.md,
    width: width * 0.9, 
  },
  activeIndicator: {
    position: 'absolute',
    height: '80%', 
    top: '10%',
    backgroundColor: '#FFF', 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, 
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Fonts.rounded,
  },
  modeTextActive: {
    color: '#000', 
    fontWeight: '700',
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  timeText: {
    fontSize: 80,
    color: '#FFF',
    fontFamily: Fonts.mono, 
    fontWeight: '700',
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
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30, // Bo tròn hoàn toàn
    minWidth: 160,
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
    fontWeight: '700', // Đậm hơn để dễ nhìn
    letterSpacing: 1,  // Khoảng cách chữ rộng ra chút cho thoáng
    textTransform: 'uppercase', // Viết hoa cho chuyên nghiệp
  },

  // 5. Khu vực Task đang chọn (Task Info Area)
  taskInfoArea: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 80,
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

  // 6. Thống kê & Quotes
  statsContainer: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  statsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  quoteContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: Fonts.sans,
    lineHeight: 24,
  }
});