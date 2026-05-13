/**
 * Task Manager - React Native App
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TaskProvider} from './src/context/TaskContext';
import HomeScreen from './src/screens/HomeScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';
import type {Task} from './src/types/Task';

type Screen = {name: 'home'} | {name: 'form'; task: Task | null};

function AppContent() {
  const [screen, setScreen] = useState<Screen>({name: 'home'});

  const handleAddTask = useCallback(() => {
    setScreen({name: 'form', task: null});
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setScreen({name: 'form', task});
  }, []);

  const handleFormDone = useCallback(() => {
    setScreen({name: 'home'});
  }, []);

  if (screen.name === 'form') {
    return <TaskFormScreen task={screen.task} onDone={handleFormDone} />;
  }

  return <HomeScreen onAddTask={handleAddTask} onEditTask={handleEditTask} />;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TaskProvider>
        <View style={styles.container}>
          <AppContent />
        </View>
      </TaskProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
