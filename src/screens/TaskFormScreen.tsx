import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTasks} from '../context/TaskContext';
import type {Category, Priority, Task} from '../types/Task';
import {CATEGORY_COLORS, CATEGORY_ICONS, PRIORITY_COLORS} from '../types/Task';

interface Props {
  task: Task | null; // null = creating new task
  onDone: () => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'health', 'other'];

export default function TaskFormScreen({task, onDone}: Props) {
  const {addTask, updateTask} = useTasks();
  const insets = useSafeAreaInsets();
  const isEditing = task !== null;

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [category, setCategory] = useState<Category>(task?.category ?? 'personal');
  const [titleError, setTitleError] = useState(false);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      setTitleError(true);
      return;
    }

    if (isEditing && task !== null) {
      updateTask({
        ...task,
        title: trimmedTitle,
        description: description.trim(),
        priority,
        category,
      });
    } else {
      addTask({
        title: trimmedTitle,
        description: description.trim(),
        priority,
        category,
        dueDate: null,
      });
    }

    onDone();
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onDone} hitSlop={12}>
          <Text style={styles.cancelButton}>{'Cancel'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Task' : 'New Task'}
        </Text>
        <Pressable onPress={handleSave} hitSlop={12}>
          <Text style={styles.saveButton}>{'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{paddingBottom: insets.bottom + 20}}
        keyboardShouldPersistTaps="handled">
        {/* Title */}
        <Text style={styles.label}>{'Title'}</Text>
        <TextInput
          style={[styles.input, titleError && styles.inputError]}
          placeholder="What do you need to do?"
          placeholderTextColor="#AAA"
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (titleError) {
              setTitleError(false);
            }
          }}
          autoFocus={!isEditing}
          returnKeyType="next"
        />
        {titleError && (
          <Text style={styles.errorText}>{'Title is required'}</Text>
        )}

        {/* Description */}
        <Text style={styles.label}>{'Description'}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add some details..."
          placeholderTextColor="#AAA"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Priority */}
        <Text style={styles.label}>{'Priority'}</Text>
        <View style={styles.optionRow}>
          {PRIORITIES.map(p => {
            const isActive = priority === p;
            const color = PRIORITY_COLORS[p];
            return (
              <Pressable
                key={p}
                style={[
                  styles.optionChip,
                  isActive && {backgroundColor: color, borderColor: color},
                ]}
                onPress={() => setPriority(p)}>
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category */}
        <Text style={styles.label}>{'Category'}</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(c => {
            const isActive = category === c;
            const color = CATEGORY_COLORS[c];
            const icon = CATEGORY_ICONS[c];
            return (
              <Pressable
                key={c}
                style={[
                  styles.categoryChip,
                  isActive && {backgroundColor: color, borderColor: color},
                ]}
                onPress={() => setCategory(c)}>
                <Text style={styles.categoryChipIcon}>{icon}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    backgroundColor: '#FFF',
  },
  cancelButton: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  saveButton: {
    fontSize: 16,
    color: '#5B5FEF',
    fontWeight: '700',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A2E',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  optionTextActive: {
    color: '#FFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  categoryChipTextActive: {
    color: '#FFF',
  },
});
