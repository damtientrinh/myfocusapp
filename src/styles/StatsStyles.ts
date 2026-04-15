import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // --- Layout Chính ---
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 16,
  },

  // --- 4. Recent Activity (Hoạt động gần đây) ---
  activityList: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 5,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  activityText: {
    fontSize: 15,
    lineHeight: 20,
  },

  

  // --- 6. Tiện ích (Reset, Toast) ---
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resetText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
  },
});