import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTriage } from '../hooks/useTriage';
import TriageLandingHero from '../components/TriageLandingHero';
import TriageStep1Vitals from '../components/TriageStep1Vitals';
import TriageStep2Health from '../components/TriageStep2Health';
import TriageStep3Habits from '../components/TriageStep3Habits';
import TriageResultView from '../components/TriageResultView';
import TriageLockedView from '../components/TriageLockedView';
import NotificationBell from '../../notifications/components/NotificationBell';
import Banner from '../../../shared/components/Banner';
import AppAlertModal from '../../../shared/components/AppAlertModal';

export default function TriageStepperScreen({ navigation }) {
  const {
    landingStarted,
    startNewTriage,
    step,
    formData,
    handleChangeField,
    handleNext,
    handlePrev,
    handleSubmit,
    handleResetForm,
    submitting,
    result,
    submitError,
    validationMessage,
    clearValidationMessage,
    triageLock,
  } = useTriage();

  const showForm = landingStarted && !triageLock.isLocked && !result;

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_triage_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.topHeader}>
        <View style={styles.topHeaderTitleRow}>
          <Text style={styles.topHeaderTitle}>Evaluación Médica</Text>
          <Ionicons name="heart" size={20} color="#D42040" />
          <Ionicons name="pulse" size={20} color="#D42040" style={styles.pulseIcon} />
        </View>
        <NotificationBell dark onPress={() => navigation?.navigate('Notifications')} />
      </View>

      {result ? (
        <TriageResultView result={result} onReset={handleResetForm} />
      ) : showForm ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.stepperHeader}>
              <Text style={styles.stepperStepText}>Paso {step} de 3</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(step / 3) * 100}%` }]} />
              </View>
            </View>

            {step === 1 && <TriageStep1Vitals formData={formData} onChangeField={handleChangeField} />}
            {step === 2 && <TriageStep2Health formData={formData} onChangeField={handleChangeField} />}
            {step === 3 && <TriageStep3Habits formData={formData} onChangeField={handleChangeField} />}

            {step === 3 ? <Banner message={submitError} /> : null}

            <View style={styles.buttonRow}>
              {step > 1 && (
                <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                  <Text style={styles.prevBtnText}>Anterior</Text>
                </TouchableOpacity>
              )}

              {step < 3 ? (
                <TouchableOpacity style={[styles.nextBtn, { flex: step === 1 ? 1 : 0.48 }]} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>Siguiente</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.submitBtn, { flex: 0.48 }]} onPress={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Enviar Triage</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <TriageLandingHero
            onStart={startNewTriage}
            onSeeHistory={() => navigation?.navigate('TriageHistory')}
            startDisabled={triageLock.isLocked}
          />

          {triageLock.isLocked ? (
            <TriageLockedView remainingMs={triageLock.remainingMs} progress={triageLock.progress} />
          ) : null}
        </ScrollView>
      )}

      <AppAlertModal
        visible={!!validationMessage}
        title="Validación Requerida"
        message={validationMessage}
        onClose={clearValidationMessage}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flex: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseIcon: {
    marginLeft: -4,
  },
  topHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    padding: 16,
  },
  stepperHeader: {
    marginBottom: 20,
  },
  stepperStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
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
    marginBottom: 30,
  },
  prevBtn: {
    flex: 0.48,
    backgroundColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  prevBtnText: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 15,
  },
  nextBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: '#D42040',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
