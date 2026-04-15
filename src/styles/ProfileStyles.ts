import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 180,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Profile Card
  profileCard: {
    marginHorizontal: 20,
    marginTop: -50, 
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    zIndex: 50,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation cho Android
    elevation: 5,
  },
  avatarContainer: {
    marginTop: -50,
    position: 'relative',
    marginBottom: 10,
    elevation: 6,
    zIndex: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#ccc',
    zIndex: 10
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  plan: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    backgroundColor: '#ffeaea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  upgradeButtonText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },

  // Common Card Style
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewMore: {
    color: '#e74c3c',
    fontSize: 14,
  },

  // Achievement Grid
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  achievementItem: {
    width: (width - 80) / 2, // Chia 2 cột
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statsLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});