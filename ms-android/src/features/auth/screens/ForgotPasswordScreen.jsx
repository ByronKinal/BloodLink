import { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import AuthTextField from '../components/AuthTextField';
import AuthPrimaryButton from '../components/AuthPrimaryButton';
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

          <View style={styles.titleWrap}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <View style={styles.titleUnderline} />
          </View>

          <Text style={styles.subtitle}>
            No te preocupes, ingresa tu correo electrónico y te enviaremos las instrucciones para
            restablecerla.
          </Text>

          <AuthTextField
            control={control}
            name="email"
            placeholder="Correo electrónico"
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            rules={{ required: 'El correo es obligatorio' }}
          />

          <Banner message={serverError} />
          <Banner message={successMessage} tone="success" />

          <AuthPrimaryButton label="Enviar instrucciones" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

          <Text
            style={styles.secondaryLink}
            onPress={() => navigation.navigate('ResetPassword', { email: getValues('email') })}
          >
            Ya tengo un código, restablecer contraseña
          </Text>

          <Text style={styles.linkRow} onPress={() => navigation.navigate('Login')}>
            <Ionicons name="arrow-back" size={14} color="#64748B" /> <Text style={styles.linkText}>Volver al inicio de sesión</Text>
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
  titleWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  titleUnderline: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D42040',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  secondaryLink: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
    textDecorationLine: 'underline',
  },
  linkRow: {
    textAlign: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#64748B',
    fontSize: 14,
  },
});
