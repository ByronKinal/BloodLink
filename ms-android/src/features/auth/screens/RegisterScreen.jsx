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
import { useRegisterWizard } from '../hooks/useRegisterWizard';
import RegisterStep1Info from '../components/RegisterStep1Info';
import RegisterStep2Security from '../components/RegisterStep2Security';
import AuthPrimaryButton from '../components/AuthPrimaryButton';
import Banner from '../../../shared/components/Banner';

export default function RegisterScreen({ navigation }) {
  const {
    control,
    step,
    handleNext,
    handlePrev,
    onSubmit,
    isSubmitting,
    password,
    serverError,
    bloodType,
    setBloodType,
    bloodTypeError,
    profilePicture,
    setProfilePicture,
    profilePictureError,
  } = useRegisterWizard({
    onSuccess: (email) => navigation.navigate('VerifyEmail', { email }),
  });

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
          <View>
            <Text style={styles.logoText}>
              Blood<Text style={styles.logoTextAccent}>Link</Text>
            </Text>
            <Text style={styles.tagline}>CONECTAMOS VIDAS, SALVAMOS VIDAS</Text>
          </View>
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Crear cuenta</Text>
          <View style={styles.titleUnderline} />
        </View>

        <Text style={styles.subtitle}>Únete a la red que conecta vidas y salva vidas.</Text>

        <View style={styles.stepperHeader}>
          <Text style={styles.stepperStepText}>Paso {step} de 2</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(step / 2) * 100}%` }]} />
          </View>
        </View>

        {step === 1 ? (
          <RegisterStep1Info
            control={control}
            profilePicture={profilePicture}
            onChangePicture={setProfilePicture}
            profilePictureError={profilePictureError}
          />
        ) : (
          <RegisterStep2Security
            control={control}
            password={password}
            bloodType={bloodType}
            onChangeBloodType={setBloodType}
            bloodTypeError={bloodTypeError}
          />
        )}

        {step === 2 ? <Banner message={serverError} /> : null}

        <View style={styles.buttonRow}>
          {step === 2 ? (
            <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
              <Text style={styles.prevBtnText}>Anterior</Text>
            </TouchableOpacity>
          ) : null}

          <View style={step === 2 ? styles.mainBtnHalf : styles.mainBtnFull}>
            {step === 1 ? (
              <AuthPrimaryButton label="Siguiente" onPress={handleNext} />
            ) : (
              <AuthPrimaryButton label="Registrarme" onPress={onSubmit} loading={isSubmitting} />
            )}
          </View>
        </View>

        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
          ¿Ya tienes cuenta? <Text style={styles.linkTextStrong}>Inicia sesión</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 64,
    height: 64,
    marginRight: 12,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
  },
  logoTextAccent: {
    color: '#D42040',
  },
  tagline: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 2,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 10,
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
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepperHeader: {
    marginBottom: 24,
  },
  stepperStepText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D42040',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  mainBtnFull: {
    flex: 1,
  },
  mainBtnHalf: {
    flex: 0.62,
  },
  prevBtn: {
    flex: 0.34,
    backgroundColor: '#E2E8F0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  prevBtnText: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 15,
  },
  linkText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
  linkTextStrong: {
    color: '#D42040',
    fontWeight: '700',
  },
});
