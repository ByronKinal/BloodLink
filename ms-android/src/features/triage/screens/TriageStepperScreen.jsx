import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTriage } from '../hooks/useTriage';
import TriageStepperHeader from '../components/TriageStepperHeader';
import TriageStep1Vitals from '../components/TriageStep1Vitals';
import TriageStep2Health from '../components/TriageStep2Health';
import TriageStep3Habits from '../components/TriageStep3Habits';
import TriageResultView from '../components/TriageResultView';
import TriageHistoryView from '../components/TriageHistoryView';
import TriageLockedView from '../components/TriageLockedView';

export default function TriageStepperScreen() {
  const {
    activeTab,
    setActiveTab,
    step,
    formData,
    handleChangeField,
    handleNext,
    handlePrev,
    handleSubmit,
    handleResetForm,
    submitting,
    result,
    history,
    loadingHistory,
    historyError,
    triageLock,
  } = useTriage();

  return (
    <View style={styles.container}>
      <TriageStepperHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'history' ? (
        <TriageHistoryView history={history} loading={loadingHistory} error={historyError} />
      ) : result ? (
        <TriageResultView result={result} onReset={handleResetForm} />
      ) : triageLock.isLocked ? (
        <TriageLockedView message={triageLock.message} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Progress Indicator */}
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperStepText}>Paso {step} de 3</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(step / 3) * 100}%` }]} />
            </View>
          </View>

          {/* Stepper Forms */}
          {step === 1 && <TriageStep1Vitals formData={formData} onChangeField={handleChangeField} />}
          {step === 2 && <TriageStep2Health formData={formData} onChangeField={handleChangeField} />}
          {step === 3 && <TriageStep3Habits formData={formData} onChangeField={handleChangeField} />}

          {/* Stepper Navigation Buttons */}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
