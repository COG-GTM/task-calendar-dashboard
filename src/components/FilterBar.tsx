import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Category} from '../types/Task';
import {CATEGORY_COLORS, CATEGORY_ICONS} from '../types/Task';

type Filter = 'all' | Category;

interface Props {
  active: Filter;
  onChange: (filter: Filter) => void;
  taskCounts: Record<Filter, number>;
}

const FILTERS: {key: Filter; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'personal', label: 'Personal'},
  {key: 'work', label: 'Work'},
  {key: 'shopping', label: 'Shopping'},
  {key: 'health', label: 'Health'},
  {key: 'other', label: 'Other'},
];

function FilterBar({active, onChange, taskCounts}: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {FILTERS.map(f => {
          const isActive = f.key === active;
          const color =
            f.key === 'all' ? '#1A1A2E' : CATEGORY_COLORS[f.key as Category];
          const icon =
            f.key === 'all' ? '\u{1F4CB}' : CATEGORY_ICONS[f.key as Category];

          return (
            <Pressable
              key={f.key}
              style={[
                styles.chip,
                isActive && {backgroundColor: color, borderColor: color},
              ]}
              onPress={() => onChange(f.key)}>
              <Text style={styles.chipIcon}>{icon}</Text>
              <Text
                style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {f.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isActive && styles.countBadgeActive,
                ]}>
                <Text
                  style={[
                    styles.countText,
                    isActive && styles.countTextActive,
                  ]}>
                  {taskCounts[f.key]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default React.memo(FilterBar);

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginRight: 6,
  },
  chipLabelActive: {
    color: '#FFF',
  },
  countBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  countTextActive: {
    color: '#FFF',
  },
});
