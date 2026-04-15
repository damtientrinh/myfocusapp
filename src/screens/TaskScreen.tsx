import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator, Alert,
    FlatList, Keyboard, Platform,
    RefreshControl,
    Text, TextInput,
    TouchableOpacity, View
} from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutAnimation } from 'react-native';

import { EmptyTask } from '../components/task/EmptyTask';
import { TaskItem } from '../components/task/TaskItem';
import { useAppContext } from '../context/AppContext';
import { useTaskLogic } from '../hooks/useTaskLogic';
import { styles } from '../styles/TaskStyles';
if (Platform.OS === 'android') {
  if (require('react-native').UIManager.setLayoutAnimationEnabledExperimental) {
    require('react-native').UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


export default function TaskScreen() {
  const { 
    taskText, setTaskText, taskList, date, setDate, toastMsg, 
    addTask, toggleTask, deleteTask, setToastMsg 
  } = useTaskLogic();

  // ✅ Xóa refreshTasks ở đây vì onSnapshot đã lo việc cập nhật Real-time
  const { theme, isDarkMode, language, setSelectedTaskId, loading } = useAppContext(); 
  const { t } = useTranslation();

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onToggleSafe = (id: string, currentStatus: boolean) => {
    // LayoutAnimation giúp hiệu ứng mượt hơn khi task nhảy xuống dưới
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleTask(id, currentStatus);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log(t('tasks.permission_denied'));
    })();

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height - (Platform.OS === 'ios' ? 10 : 0))
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Sắp xếp Task: Chưa hoàn thành lên trước, task mới nhất lên trên
  const sortedTasks = useMemo(() => { 
    if (!taskList) return [];
    return [...taskList].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Firebase dùng serverTimestamp nên so sánh chuỗi ISO từ code trước đó
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [taskList]);

  const handleAddTask = async () => {
    if (taskText.trim().length === 0) {
      Alert.alert(t('common.notice'), t('tasks.empty_input_msg', "Bạn nhập nội dung nhiệm vụ đã nhé!"));
      return;
    };
    
    try {
      await addTask(); 
      // Không cần setTaskText('') ở đây vì trong useTaskLogic đã làm rồi
      Keyboard.dismiss(); 
    } catch (error) {
      console.log("Lỗi thêm task tại Screen:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, marginBottom: keyboardHeight }}>
          
          <View style={[styles.container, { flex: 1 }]}>
            <Text style={[styles.header, { color: theme.text }]}>
              {t('tasks.header')}
            </Text>

            <FlatList 
              data={sortedTasks}
              keyExtractor={item => item.id}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled" 
              // ✅ Sửa RefreshControl: Chỉ dùng loading để hiện spinner khi Firestore đang fetch lần đầu
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={() => {}} tintColor={theme.text} enabled={false} />
              }
              renderItem={({ item }) => (
                <TaskItem 
                  task={item} 
                  onToggle={() => onToggleSafe(item.id, item.completed)}
                  onDelete={(id: string) => deleteTask(id)}
                  onSelect={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    if (setSelectedTaskId) {
                      setSelectedTaskId(item.id); 
                      setToastMsg(t('tasks.selected_for_focus'));
                    }
                  }}
                />
              )}
              ListEmptyComponent={loading ? <ActivityIndicator color={theme.text} style={{ marginTop: 20 }} /> : <EmptyTask />}
              contentContainerStyle={styles.listContent}
            />

            {/* Input Footer */}
            <View style={[styles.footerWrapper, { 
              backgroundColor: theme.background, 
              borderTopColor: theme.border, 
              borderTopWidth: 0.5 
            }]}>
              <View style={styles.dateTimePreview}>
                <TouchableOpacity 
                  style={[styles.dateTimeButton, { backgroundColor: theme.card }]} 
                  onPress={() => { setPickerMode('date'); setShowPicker(true); }}
                >
                  <Text style={[styles.dateTimeText, { color: theme.text }]}>
                    📅 {date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.dateTimeButton, { backgroundColor: theme.card }]}
                  onPress={() => { setPickerMode('time'); setShowPicker(true); }}
                >
                  <Text style={[styles.dateTimeText, { color: theme.text }]}> 
                    ⏰ {date.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                <TextInput 
                  style={[styles.input, { color: theme.text }]} 
                  value={taskText} 
                  onChangeText={setTaskText} 
                  placeholder={t('tasks.placeholder')}
                  placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  onSubmitEditing={handleAddTask}
                  returnKeyType="done"
                />
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: theme.primary || '#FF5252' }]} 
                  onPress={handleAddTask}
                >
                  <Text style={styles.plus}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {showPicker && (
          <DateTimePicker 
            value={date} 
            mode={pickerMode} 
            is24Hour={true} 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => { 
              setShowPicker(false); 
              if(selectedDate) setDate(selectedDate); 
            }} 
          />
        )}

        {toastMsg !== '' && (
          <Animated.View 
            entering={FadeInUp} 
            exiting={FadeOutDown}
            style={[styles.toastContainer, { backgroundColor: theme.text, position: 'absolute', top: 50, alignSelf: 'center' }]}
          >
            <Text style={[styles.toastText, { color: theme.background }]}>{toastMsg}</Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}