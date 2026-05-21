import { getTopRankings } from '@/components/services/leaderboard';
import { styles } from '@/styles/LeaderboardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator, FlatList, Image, RefreshControl,
  Text, TouchableOpacity, View
} from 'react-native';


export default function LeaderboardScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const { t } = useTranslation();
  
  const [filter, setFilter] = useState<'today' | 'weekly' | 'month'>('month');

  const loadData = async () => {
    setLoading(true);
    try {
      const rankings = await getTopRankings(filter);
      setData(rankings || []);
    } catch (error) {
      console.error("Lỗi khi load BXH:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const renderItem = ({ item, index }: any) => {
    const isFirst = index === 0;
    const isTop3 = index < 3;
    
    const getBadgeColor = (): string[] => {
      if (index === 0) return ['#FFD700', '#FFA500'];
      if (index === 1) return ['#BDC3C7', '#7F8C8D'];
      if (index === 2) return ['#E67E22', '#D35400'];
      return ['#F0F0F0', '#E0E0E0'];
    };

    return (
      <View style={[styles.itemCard, isFirst && styles.firstPlaceCard]}>
        <LinearGradient
          colors={getBadgeColor() as any}
          style={styles.rankBadge}
        >
          <Text style={[styles.rankText, isTop3 && { color: '#fff' }]}>
            {index === 0 ? '👑' : `${index + 1}`}
          </Text>
        </LinearGradient>

        <View style={styles.avatarPlaceholder}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitial}>
              {String(item.displayName || item.email || 'U')[0].toUpperCase()}
            </Text>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.displayName || item.email?.split('@')[0]}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{item.totalSessions || 0}</Text>
          <Text style={styles.scoreUnit}>{t('leaderboard.sessions_unit')}</Text>
        </View>
      </View>
    );
  };

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      {(['today', 'weekly', 'month'] as const).map((type) => (
        <TouchableOpacity 
          key={type} 
          style={styles.filterItem}
          onPress={() => setFilter(type)} 
        >
          <Text style={[styles.filterText, filter === type && styles.filterActive]}>
            {t(`leaderboard.${type}`)}
          </Text>
          {filter === type && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FF6347', '#FF4500']} style={styles.header}>
        <Text style={styles.headerTitle}>{t('leaderboard.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('leaderboard.subtitle')}</Text>
      </LinearGradient>
      
      {renderFilters()}
      
      {loading && data.length === 0 ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} tintColor="#FF6347" />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', color: '#999' }}>
                {t('leaderboard.empty')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}