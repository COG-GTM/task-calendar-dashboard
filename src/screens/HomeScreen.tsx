import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';
import TaskItem from '../components/TaskItem';
import {useTasks} from '../context/TaskContext';
import type {Category, Task} from '../types/Task';

type Filter = 'all' | Category;

interface Props {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export default function HomeScreen({onAddTask, onEditTask}: Props) {
  const {tasks, toggleTask, deleteTask} = useTasks();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const insets = useSafeAreaInsets();

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') {
      return tasks;
    }
    return tasks.filter(t => t.category === activeFilter);
  }, [tasks, activeFilter]);

  const taskCounts = useMemo(() => {
    const counts: Record<Filter, number> = {
      all: tasks.length,
      personal: 0,
      work: 0,
      shopping: 0,
      health: 0,
      other: 0,
    };
    for (const t of tasks) {
      counts[t.category] += 1;
    }
    return counts;
  }, [tasks]);

  const completedCount = useMemo(
    () => tasks.filter(t => t.completed).length,
    [tasks],
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: () => deleteTask(id)},
      ]);
    },
    [deleteTask],
  );

  const renderItem = useCallback(
    ({item}: {item: Task}) => (
      <TaskItem
        task={item}
        onPress={onEditTask}
        onToggle={toggleTask}
        onDelete={handleDelete}
      />
    ),
    [onEditTask, toggleTask, handleDelete],
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{'My Tasks'}</Text>
          <Text style={styles.summary}>
            {tasks.length === 0
              ? 'No tasks yet'
              : completedCount + ' of ' + tasks.length + ' completed'}
          </Text>
        </View>
        {tasks.length > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      (`${tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%`) as unknown as number,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {tasks.length > 0
                ? Math.round((completedCount / tasks.length) * 100)
                : 0}
              {'%'}
            </Text>
          </View>
        )}
      </View>

      {/* Filter Bar */}
      <FilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        taskCounts={taskCounts}
      />

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={
          filteredTasks.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={
          <EmptyState filtered={activeFilter !== 'all' && tasks.length > 0} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <Pressable
        style={[styles.fab, {bottom: Math.max(insets.bottom, 16) + 16}]}
        onPress={onAddTask}>
        <Text style={styles.fabText}>{'+'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
    minWidth: 36,
    textAlign: 'right',
  },
  list: {
    paddingBottom: 100,
    paddingTop: 4,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B5FEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B5FEF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '300',
    marginTop: -2,
  },
});
