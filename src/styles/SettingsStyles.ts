import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 32, // Tăng nhẹ cho đúng chuẩn Large Title
    fontWeight: '800',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 20, // Đưa phần bù lên container bọc ngoài
    paddingBottom: 10,
  },
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
    opacity: 0.6, // Làm mờ nhẹ để nổi bật phần nội dung chính
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 24, // Bo tròn mạnh hơn nhìn sẽ cao cấp hơn
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    // Shadow nhẹ nhàng hơn
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Tăng nhẹ để bấm (touch target) dễ hơn
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  title: {
    flex: 1, // Để Title chiếm hết chỗ trống, đẩy Value/Switch sang phải
    fontSize: 16,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 15,
    marginRight: 4,
  },
  slider: {
    width: '105%', // Hơi rộng ra một chút để bù trừ padding của container
    alignSelf: 'center',
    height: 40,
    marginTop: 8,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
    marginBottom: 40, 
    opacity: 0.5,
  },
});