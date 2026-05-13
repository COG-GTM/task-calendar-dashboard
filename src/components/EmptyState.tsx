import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  filtered: boolean;
}

function EmptyState({filtered}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{filtered ? '\u{1F50D}' : '\u{1F389}'}</Text>
      <Text style={styles.title}>
        {filtered ? 'No matching tasks' : 'No tasks yet'}
      </Text>
      <Text style={styles.subtitle}>
        {filtered
          ? 'Try a different filter or add a new task.'
          : 'Tap the + button to create your first task!'}
      </Text>
    </View>
  );
}

export default React.memo(EmptyState);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
