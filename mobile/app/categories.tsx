import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { CategoryTile } from '@/components/Events';
import { CATEGORIES } from '@/data';
import { useLayout } from '@/lib/layout';

/** Browse by Category — grid sorted by live count. */
export default function Categories() {
  const router = useRouter();
  const { wide } = useLayout();
  const sorted = [...CATEGORIES].sort((a, b) => b.count - a.count);
  return (
    <Screen title="Browse by Category">
      <View style={s.grid}>
        {sorted.map((c) => (
          <View key={c.name} style={{ width: wide ? '32%' : '48.5%' }}>
            <CategoryTile name={c.name} icon={c.icon} count={c.count} onPress={() => router.push(`/list/${encodeURIComponent(c.name)}`)} />
          </View>
        ))}
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, paddingHorizontal: 16 } });
