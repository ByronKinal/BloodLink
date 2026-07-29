import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';

export default function FormField({
  control,
  name,
  rules,
  label,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
        </View>
      )}
    />
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
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputError: {
    borderColor: '#D42040',
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginTop: 4,
  },
});
