import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as authApi from '../api/auth.api';
import FormField from '../../../shared/components/FormField';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import Banner from '../../../shared/components/Banner';

export default function ResetPasswordScreen({ navigation }) {
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { token: '', newPassword: '', confirmPassword: '' },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await authApi.resetPassword({ token: values.token, newPassword: values.newPassword });
      navigation.navigate('Login');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'No se pudo restablecer la contraseña.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer contraseña</Text>

      <FormField
        control={control}
        name="token"
        label="Código de recuperación"
        placeholder="Pega aquí el código que recibiste"
        rules={{ required: 'El código de recuperación es obligatorio' }}
      />

      <FormField
        control={control}
        name="newPassword"
        label="Nueva contraseña"
        placeholder="********"
        secureTextEntry
        autoCapitalize="none"
        rules={{
          required: 'La nueva contraseña es obligatoria',
          minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
        }}
      />

      <FormField
        control={control}
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="********"
        secureTextEntry
        autoCapitalize="none"
        rules={{
          required: 'Confirma tu contraseña',
          validate: (value) => value === newPassword || 'Las contraseñas no coinciden',
        }}
      />

      <Banner message={serverError} />

      <PrimaryButton label="Restablecer" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

      <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
        Volver a iniciar sesión
      </Text>
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
  linkText: {
    color: '#D42040',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
});
