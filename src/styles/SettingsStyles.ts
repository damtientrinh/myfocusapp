import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: 10,
  },
  // --- PHẦN MỚI BỔ SUNG: PROFILE CARD ---
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    // Đổ bóng cho phần profile xịn hơn
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  // --------------------------------------
  sectionHeader: {
    paddingHorizontal: 28,
    marginTop: 15,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#f5f5f5', // Màu mặc định nếu không truyền style động
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 15,
    marginRight: 4,
  },
  slider: {
    width: '100%', // Để 100% cho ổn định
    alignSelf: 'center',
    height: 40,
    marginTop: 8,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 100, 
    opacity: 0.5,
  },
});