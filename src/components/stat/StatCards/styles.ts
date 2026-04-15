import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({ 
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    width: (width - 50) / 2, 
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Elevation cho Android
    elevation: 2,
  },
  longCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    marginTop: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '700',
  },
});