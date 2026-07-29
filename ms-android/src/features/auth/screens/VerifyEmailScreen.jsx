import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import OtpCodeInput from '../components/OtpCodeInput';
import AuthPrimaryButton from '../components/AuthPrimaryButton';
import Banner from '../../../shared/components/Banner';
import { getErrorMessage } from '../../../shared/utils/apiError';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailScreen({ navigation, route }) {
  const { verifyEmail, resendVerification } = useAuth();
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
      await verifyEmail(values);
      navigation.navigate('Login');
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo verificar tu cuenta. Intenta de nuevo.'));
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
      await resendVerification({ email });
      setResendMessage('Código reenviado. Revisa tu correo.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo reenviar el código.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_background_clean.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Image
              source={require('../../../../assets/img/bloodlink_icon.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>
              Blood<Text style={styles.logoTextAccent}>Link</Text>
            </Text>
            <Text style={styles.tagline}>CONECTAMOS VIDAS, SALVAMOS VIDAS</Text>
          </View>

          <Text style={styles.title}>Verifica tu cuenta</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo a continuación.
          </Text>

          <OtpCodeInput
            control={control}
            name="activationCode"
            rules={{
              required: 'El código de activación es obligatorio',
              minLength: { value: 6, message: 'El código debe tener 6 dígitos' },
            }}
          />

          <Banner message={serverError} />
          <Banner message={resendMessage} tone="success" />

          <AuthPrimaryButton label="Verificar" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

          <Text style={styles.resendRow}>
            <Text style={styles.resendMuted}>¿No recibiste el código? </Text>
            <Text
              style={[styles.resendLink, cooldown > 0 && styles.resendLinkDisabled]}
              onPress={cooldown > 0 || isResending ? undefined : onResend}
            >
              {cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Reenviar código'}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E293B',
  },
  logoTextAccent: {
    color: '#D42040',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  resendRow: {
    textAlign: 'center',
    marginTop: 20,
  },
  resendMuted: {
    color: '#64748B',
    fontSize: 13,
  },
  resendLink: {
    color: '#D42040',
    fontSize: 13,
    fontWeight: '700',
  },
  resendLinkDisabled: {
    color: '#94A3B8',
  },
});
