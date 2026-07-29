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
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import AuthTextField from '../components/AuthTextField';
import AuthPrimaryButton from '../components/AuthPrimaryButton';
import Banner from '../../../shared/components/Banner';
import { getErrorMessage } from '../../../shared/utils/apiError';

export default function ResetPasswordScreen({ navigation }) {
  const { resetPassword } = useAuth();
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
      await resetPassword({ token: values.token, newPassword: values.newPassword });
      navigation.navigate('Login');
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo restablecer la contraseña.'));
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
            <Text style={styles.title}>Restablecer contraseña</Text>
            <View style={styles.titleUnderline} />
          </View>

          <AuthTextField
            control={control}
            name="token"
            placeholder="Código de recuperación"
            icon="key-outline"
            autoCapitalize="none"
            rules={{ required: 'El código de recuperación es obligatorio' }}
          />

          <AuthTextField
            control={control}
            name="newPassword"
            placeholder="Nueva contraseña"
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            rules={{
              required: 'La nueva contraseña es obligatoria',
              minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
            }}
          />

          <AuthTextField
            control={control}
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            rules={{
              required: 'Confirma tu contraseña',
              validate: (value) => value === newPassword || 'Las contraseñas no coinciden',
            }}
          />

          <Banner message={serverError} />

          <AuthPrimaryButton label="Restablecer" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

          <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
            Volver a iniciar sesión
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
    marginBottom: 24,
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
  linkText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
