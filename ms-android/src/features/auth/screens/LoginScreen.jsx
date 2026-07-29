import { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import AuthTextField from '../components/AuthTextField';
import AuthPrimaryButton from '../components/AuthPrimaryButton';
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
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_background_clean.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Image
              source={require('../../../../assets/img/bloodlink_icon.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <View style={styles.logoTextWrap}>
              <Text style={styles.logoText}>
                Blood<Text style={styles.logoTextAccent}>Link</Text>
              </Text>
              <Text style={styles.tagline}>CONECTAMOS VIDAS, SALVAMOS VIDAS</Text>
            </View>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <View style={styles.titleUnderline} />
          </View>

          <AuthTextField
            control={control}
            name="emailOrUsername"
            placeholder="Email / Usuario"
            icon="person-outline"
            autoCapitalize="none"
            rules={{ required: 'El correo o usuario es obligatorio' }}
          />

          <AuthTextField
            control={control}
            name="password"
            placeholder="Contraseña"
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            rules={{ required: 'La contraseña es obligatoria' }}
          />

          <Banner message={serverError} />

          <AuthPrimaryButton label="Ingresar" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={8}
          >
            <Ionicons name="lock-closed" size={15} color="#D42040" />
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('Register')}
            hitSlop={8}
          >
            <Ionicons name="person-add-outline" size={15} color="#64748B" />
            <Text style={styles.linkTextMuted}>
              ¿No tienes cuenta? <Text style={styles.linkTextStrong}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
  },
  logoIcon: {
    width: 76,
    height: 76,
    marginRight: 14,
  },
  logoTextWrap: {
    flexShrink: 1,
  },
  logoText: {
    fontSize: 32,
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
    marginTop: 2,
  },
  titleWrap: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
  },
  titleUnderline: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D42040',
    marginTop: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  linkText: {
    color: '#D42040',
    fontSize: 13,
    fontWeight: '600',
  },
  linkTextMuted: {
    color: '#64748B',
    fontSize: 13,
  },
  linkTextStrong: {
    color: '#D42040',
    fontWeight: '700',
  },
});
