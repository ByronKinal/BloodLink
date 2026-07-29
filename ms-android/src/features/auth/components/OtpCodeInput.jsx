import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';

const CODE_LENGTH = 6;

export default function OtpCodeInput({ control, name, rules }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View style={styles.boxRow}>
            {Array.from({ length: CODE_LENGTH }).map((_, index) => {
              const digit = value[index] || '';
              const isActive = index === value.length;
              return (
                <View
                  key={index}
                  style={[styles.box, isActive ? styles.boxActive : null, error ? styles.boxError : null]}
                >
                  <Text style={styles.boxText}>{digit}</Text>
                </View>
              );
            })}
          </View>

          <TextInput
            value={value}
            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            style={styles.hiddenInput}
            autoFocus
          />

          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9EDF1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: '#D42040',
  },
  boxError: {
    borderColor: '#D42040',
  },
  boxText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
