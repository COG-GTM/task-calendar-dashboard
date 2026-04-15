import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {Task} from '../types/Task';
import {CATEGORY_COLORS, CATEGORY_ICONS, PRIORITY_COLORS} from '../types/Task';

interface Props {
  task: Task;
  onPress: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TaskItem({task, onPress, onToggle, onDelete}: Props) {
  const priorityColor = PRIORITY_COLORS[task.priority];
  const categoryColor = CATEGORY_COLORS[task.category];
  const categoryIcon = CATEGORY_ICONS[task.category];

  return (
    <Pressable
      style={({pressed}) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(task)}>
      <View style={[styles.priorityBar, {backgroundColor: priorityColor}]} />

      <Pressable
        style={styles.checkbox}
        onPress={() => onToggle(task.id)}
        hitSlop={8}>
        <View
          style={[
            styles.checkboxInner,
            task.completed && {backgroundColor: '#4CAF50', borderColor: '#4CAF50'},
          ]}>
          {task.completed && <Text style={styles.checkmark}>{'✓'}</Text>}
        </View>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, task.completed && styles.completedTitle]}
            numberOfLines={1}>
            {task.title}
          </Text>
          <View style={[styles.categoryBadge, {backgroundColor: categoryColor + '20'}]}>
            <Text style={styles.categoryIcon}>{categoryIcon}</Text>
            <Text style={[styles.categoryText, {color: categoryColor}]}>
              {task.category}
            </Text>
          </View>
        </View>

        {task.description.length > 0 && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View style={[styles.priorityBadge, {backgroundColor: priorityColor + '20'}]}>
            <Text style={[styles.priorityText, {color: priorityColor}]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>
          {task.dueDate !== null && (
            <Text style={styles.dueDate}>
              {'Due: ' + new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
        hitSlop={8}>
        <Text style={styles.deleteText}>{'✕'}</Text>
      </Pressable>
    </Pressable>
  );
}

export default React.memo(TaskItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
  priorityBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  checkbox: {
    padding: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
    marginRight: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: 11,
    color: '#888',
  },
  deleteButton: {
    padding: 12,
  },
  deleteText: {
    fontSize: 18,
    color: '#CCC',
    fontWeight: '600',
  },
});
