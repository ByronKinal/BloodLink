import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { emailOrUsername: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await signIn(values);
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo iniciar sesión. Intenta de nuevo.';
      setServerError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <Controller
        control={control}
        name="emailOrUsername"
        rules={{ required: 'El correo o usuario es obligatorio' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Correo o usuario"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.emailOrUsername ? (
        <Text style={styles.errorText}>{errors.emailOrUsername.message}</Text>
      ) : null}

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'La contraseña es obligatoria',
          minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#D42040',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
