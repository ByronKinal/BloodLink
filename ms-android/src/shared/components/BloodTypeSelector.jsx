import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodTypeSelector({ value, onChange, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de sangre</Text>
      <View style={styles.grid}>
        {BLOOD_TYPES.map((type) => {
          const selected = value === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.chip, selected ? styles.chipSelected : null]}
              onPress={() => onChange(type)}
            >
              <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#D42040',
    borderColor: '#D42040',
  },
  chipText: {
    fontSize: 13,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginTop: 4,
  },
});
