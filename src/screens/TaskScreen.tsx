import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList, Keyboard, Platform,
    RefreshControl,
    Text, TextInput,
    TouchableOpacity, View
} from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

import { EmptyTask } from '../components/task/EmptyTask';
import { TaskItem } from '../components/task/TaskItem';
import { useAppContext } from '../context/AppContext';
import { useTaskLogic } from '../hooks/useTaskLogic';
import { styles } from '../styles/TaskStyles';

export default function TaskScreen() {
  const { 
    taskText, setTaskText, taskList, date, setDate, toastMsg, 
    addTask, toggleTask, deleteTask, setToastMsg 
  } = useTaskLogic();

  const { theme, isDarkMode, language, setSelectedTaskId, loading, refreshTasks } = useAppContext(); 
  const { t } = useTranslation();

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  
  // FIX BÀN PHÍM: Chiều cao padding động
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Xin quyền thông báo
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log(t('tasks.permission_denied'));
    })();

    // Listener bàn phím để đẩy layout lên thủ công (Chính xác hơn KeyboardAvoidingView)
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

  useEffect(() => {
    if (toastMsg !== '') {
      const timer = setTimeout(() => setToastMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const sortedTasks = useMemo(() => { 
    if (!taskList) return [];
    return [...taskList].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [taskList]);

  const handleAddTask = async () => {
    const textToSubmit = taskText.trim();
    if (textToSubmit.length === 0) return;
    
    try {
      // Ép thực thi addTask từ hook
      await addTask(); 
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Xoá text ngay lập tức sau khi thêm thành công
      setTaskText(''); 
    } catch (error) {
      console.log("Add task error:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Container chính đẩy lên theo keyboardHeight */}
      <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
        
        <View style={[styles.container, { flex: 1 }]}>
          <Text style={[styles.header, { color: theme.text }]}>
            {t('tasks.header')}
          </Text>

          <FlatList 
            data={sortedTasks}
            keyExtractor={item => item.id}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled" 
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refreshTasks} tintColor={theme.text} />
            }
            renderItem={({ item }: { item: any }) => (
              <TaskItem 
                task={item} 
                onToggle={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleTask(item.id); 
                }}

                onDelete={(id: string) => { 
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  deleteTask(id); 
                }}
                onSelect={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  if (setSelectedTaskId) {
                    setSelectedTaskId(item.id); 
                    setToastMsg(t('tasks.selected_for_focus', '🚀 Đã chọn task tập trung!'));
                  }
                }}
              />
            )}
            ListEmptyComponent={loading ? <ActivityIndicator color={theme.text} /> : <EmptyTask />}
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
                submitBehavior="submit"
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
  );
}