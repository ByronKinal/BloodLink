import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

export default function AuthTextField({
  control,
  name,
  rules,
  placeholder,
  icon,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  containerStyle,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={[styles.container, containerStyle]}>
          <View style={[styles.field, error ? styles.fieldError : null]}>
            <Ionicons name={icon} size={20} color="#94A3B8" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              secureTextEntry={hidden}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {secureTextEntry ? (
              <TouchableOpacity onPress={() => setHidden((prev) => !prev)} hitSlop={8}>
                <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>
          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E9EDF1',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  fieldError: {
    borderColor: '#D42040',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    padding: 0,
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 6,
  },
});
