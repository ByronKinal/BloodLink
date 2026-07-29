import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabSwitcher({ tabs, activeTab, onChange }) {
  return (
    <View style={styles.tabSwitcher}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            onPress={() => onChange(tab.value)}
          >
            {tab.icon ? (
              <Ionicons name={tab.icon} size={16} color={isActive ? '#D42040' : '#94A3B8'} />
            ) : null}
            <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#D42040',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#D42040',
  },
  tabBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#D42040',
    fontWeight: '700',
  },
});
