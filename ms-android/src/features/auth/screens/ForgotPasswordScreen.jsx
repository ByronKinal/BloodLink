import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import FormField from '../../../shared/components/FormField';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import Banner from '../../../shared/components/Banner';
import { getErrorMessage } from '../../../shared/utils/apiError';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword } = useAuth();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    setSuccessMessage('');
    try {
      await forgotPassword(values);
      setSuccessMessage('Si el correo existe, te enviamos un enlace de recuperación.');
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo procesar la solicitud.'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>Te enviaremos un código para restablecer tu contraseña.</Text>

      <FormField
        control={control}
        name="email"
        label="Correo electrónico"
        placeholder="maria@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        rules={{ required: 'El correo es obligatorio' }}
      />

      <Banner message={serverError} />
      <Banner message={successMessage} tone="success" />

      <PrimaryButton label="Enviar" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

      <Text
        style={styles.linkText}
        onPress={() => navigation.navigate('ResetPassword', { email: getValues('email') })}
      >
        Ya tengo un código, restablecer contraseña
      </Text>

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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  linkText: {
    color: '#D42040',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
});
