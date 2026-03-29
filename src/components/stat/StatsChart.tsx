import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useAppContext } from '@/context/AppContext'; 
import { styles } from '../../styles/StatsStyles';

const screenWidth = Dimensions.get('window').width;

export const StatsChart = ({ taskList }: { taskList: any[] }) => {
  const { theme, isDarkMode } = useAppContext();

  // 1. Tạo mảng 7 ngày gần nhất (từ hôm nay lùi về sau)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }).reverse();

  // 2. Tính tổng cà chua cho từng ngày
  const dataPoints = last7Days.map(dayLabel => {
    return taskList.reduce((acc, task) => {
      if (!task.createdAt) return acc;
      
      // Chuyển đổi createdAt (từ Firebase hoặc string) sang Date để so sánh
      const taskDate = task.createdAt?.toDate ? task.createdAt.toDate() : new Date(task.createdAt);
      const taskDay = taskDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

      return taskDay === dayLabel ? acc + (task.pomodoroCount || 0) : acc;
    }, 0);
  });

  const data = {
    labels: last7Days,
    datasets: [{ data: dataPoints }]
  };

  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.card, borderRadius: 20 }]}>
      <BarChart
        data={data}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="" 
        yAxisSuffix=" 🍅"
        fromZero={true}
        chartConfig={{
          // Sử dụng màu từ theme để tự động đổi màu nền biểu đồ
          backgroundColor: theme.card,
          backgroundGradientFrom: theme.card,
          backgroundGradientTo: theme.card,
          decimalPlaces: 0,
          // Màu của cột (Cà chua thì dùng màu đỏ primary của Trình)
          color: (opacity = 1) => isDarkMode ? `rgba(255, 107, 107, ${opacity})` : `rgba(245, 86, 86, ${opacity})`, 
          // Màu của chữ nhãn ngày tháng
          labelColor: (opacity = 1) => theme.subText,
          propsForDots: { r: "6", strokeWidth: "2", stroke: theme.primary },
          barPercentage: 0.5,
          fillShadowGradientOpacity: 1,
          fillShadowGradient: isDarkMode ? '#FF6B6B' : '#f55656',
        }}
        verticalLabelRotation={0}
        style={{ borderRadius: 20, marginVertical: 10, paddingRight: 40 }}
        flatColor={true}
        showValuesOnTopOfBars={true}
      />
    </View>
  );
};