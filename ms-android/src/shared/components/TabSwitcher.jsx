import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabSwitcher({ tabs, activeTab, onChange }) {
  return (
    <View style={styles.tabSwitcher}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          style={[styles.tabBtn, activeTab === tab.value && styles.tabBtnActive]}
          onPress={() => onChange(tab.value)}
        >
          <Text style={[styles.tabBtnText, activeTab === tab.value && styles.tabBtnTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    marginTop: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#D42040',
  },
  tabBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
});
