import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as authApi from '../api/auth.api';
import FormField from '../../../shared/components/FormField';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import Banner from '../../../shared/components/Banner';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailScreen({ navigation, route }) {
  const [serverError, setServerError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: route.params?.email ?? '',
      activationCode: '',
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await authApi.verifyEmail(values);
      navigation.navigate('Login');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'No se pudo verificar tu cuenta. Intenta de nuevo.');
    }
  };

  const onResend = async () => {
    const email = getValues('email');

    if (!email) {
      setServerError('Ingresa tu correo para reenviar el código');
      return;
    }

    setServerError('');
    setResendMessage('');
    setIsResending(true);

    try {
      await authApi.resendVerification({ email });
      setResendMessage('Código reenviado. Revisa tu correo.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setServerError(error?.response?.data?.message || 'No se pudo reenviar el código.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu correo</Text>
      <Text style={styles.subtitle}>Ingresa el código de activación que enviamos a tu correo electrónico.</Text>

      <FormField
        control={control}
        name="email"
        label="Correo electrónico"
        placeholder="maria@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        rules={{ required: 'El correo es obligatorio' }}
      />

      <FormField
        control={control}
        name="activationCode"
        label="Código de activación"
        placeholder="123456"
        keyboardType="number-pad"
        rules={{ required: 'El código de activación es obligatorio' }}
      />

      <Banner message={serverError} />
      <Banner message={resendMessage} tone="success" />

      <PrimaryButton label="Verificar cuenta" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

      <Text
        style={[styles.linkText, cooldown > 0 ? styles.linkTextDisabled : null]}
        onPress={cooldown > 0 || isResending ? undefined : onResend}
      >
        {cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Reenviar código'}
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
  linkTextDisabled: {
    color: '#999',
  },
});
