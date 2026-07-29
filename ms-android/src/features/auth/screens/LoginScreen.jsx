import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import FormField from '../../../shared/components/FormField';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import Banner from '../../../shared/components/Banner';
import { getErrorMessage } from '../../../shared/utils/apiError';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { emailOrUsername: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await signIn(values);
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo iniciar sesión. Intenta de nuevo.'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <FormField
        control={control}
        name="emailOrUsername"
        placeholder="Correo o usuario"
        autoCapitalize="none"
        rules={{ required: 'El correo o usuario es obligatorio' }}
      />

      <FormField
        control={control}
        name="password"
        placeholder="Contraseña"
        secureTextEntry
        autoCapitalize="none"
        rules={{ required: 'La contraseña es obligatoria' }}
      />

      <Banner message={serverError} />

      <PrimaryButton label="Ingresar" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

      <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPassword')}>
        ¿Olvidaste tu contraseña?
      </Text>

      <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
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
