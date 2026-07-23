import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mongoApi } from '../../../shared/api/api';

const INITIAL_FORM = {
  edadAnios: '',
  pesoKg: '',
  pulsoBpm: '',
  presionSistolicaMmHg: '',
  presionDiastolicaMmHg: '',
  temperaturaC: '',
  hemoglobinaGdl: '',
  tieneFiebre: false,
  tieneSintomasInfeccion: false,
  tieneEnfermedadCronica: false,
  enfermedadCronicaControlada: true,
  consumioAlcoholUltimas24h: false,
  tomoAntibioticosUltimos7d: false,
  embarazadaOLactando: false,
  tuvoTatuajeOPiercing: false,
  tuvoCirugiaReciente: false,
};

export default function TriageStepperScreen() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const fetchTriageHistory = async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await mongoApi.get('/api/v1/triage');
      const data = res.data?.data || res.data;
      setHistory(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.log('Error fetching triage history:', err?.message);
      setHistoryError('No se pudo cargar el historial de triage.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchTriageHistory();
    }
  }, [activeTab]);

  const handleChangeField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validations per step
  const validateStep1 = () => {
    const edad = parseFloat(formData.edadAnios);
    const peso = parseFloat(formData.pesoKg);
    const pulso = parseFloat(formData.pulsoBpm);
    const sist = parseFloat(formData.presionSistolicaMmHg);
    const diast = parseFloat(formData.presionDiastolicaMmHg);
    const temp = parseFloat(formData.temperaturaC);
    const hemo = parseFloat(formData.hemoglobinaGdl);

    if (isNaN(edad) || edad < 18 || edad > 65) {
      Alert.alert('Validación Requerida', 'La edad debe estar entre 18 y 65 años.');
      return false;
    }
    if (isNaN(peso) || peso < 40 || peso > 220) {
      Alert.alert('Validación Requerida', 'El peso debe ser mayor a 40 kg (recomendado >50kg).');
      return false;
    }
    if (isNaN(pulso) || pulso < 40 || pulso > 140) {
      Alert.alert('Validación Requerida', 'El pulso debe estar entre 40 y 140 BPM.');
      return false;
    }
    if (isNaN(sist) || sist < 80 || sist > 200) {
      Alert.alert('Validación Requerida', 'Presión Sistólica fuera de rango razonable (80-200 mmHg).');
      return false;
    }
    if (isNaN(diast) || diast < 40 || diast > 120) {
      Alert.alert('Validación Requerida', 'Presión Diastólica fuera de rango razonable (40-120 mmHg).');
      return false;
    }
    if (isNaN(temp) || temp < 34 || temp > 42) {
      Alert.alert('Validación Requerida', 'Temperatura corporal fuera de rango (34-42 °C).');
      return false;
    }
    if (isNaN(hemo) || hemo < 8 || hemo > 22) {
      Alert.alert('Validación Requerida', 'Nivel de hemoglobina fuera de rango (8-22 g/dL).');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);

    const payload = {
      edadAnios: Number(formData.edadAnios),
      pesoKg: Number(formData.pesoKg),
      pulsoBpm: Number(formData.pulsoBpm),
      presionSistolicaMmHg: Number(formData.presionSistolicaMmHg),
      presionDiastolicaMmHg: Number(formData.presionDiastolicaMmHg),
      temperaturaC: Number(formData.temperaturaC),
      hemoglobinaGdl: Number(formData.hemoglobinaGdl),
      tieneFiebre: Boolean(formData.tieneFiebre),
      tieneSintomasInfeccion: Boolean(formData.tieneSintomasInfeccion),
      tieneEnfermedadCronica: Boolean(formData.tieneEnfermedadCronica),
      enfermedadCronicaControlada: Boolean(formData.enfermedadCronicaControlada),
      consumioAlcoholUltimas24h: Boolean(formData.consumioAlcoholUltimas24h),
      tomoAntibioticosUltimos7d: Boolean(formData.tomoAntibioticosUltimos7d),
      embarazadaOLactando: Boolean(formData.embarazadaOLactando),
      tuvoTatuajeOPiercing: Boolean(formData.tuvoTatuajeOPiercing),
      tuvoCirugiaReciente: Boolean(formData.tuvoCirugiaReciente),
    };

    try {
      const response = await mongoApi.post('/api/v1/triage', payload);
      const resData = response.data?.data || response.data;
      setResult({
        success: true,
        data: resData,
        message: resData?.message || 'Triage médico enviado con éxito.',
      });
    } catch (err) {
      console.log('Error submitting triage:', err?.message);
      // Evaluacion local clinica en caso de mock/fallback
      const esApto =
        payload.edadAnios >= 18 &&
        payload.pesoKg >= 50 &&
        !payload.tieneFiebre &&
        !payload.tieneSintomasInfeccion &&
        !payload.consumioAlcoholUltimas24h &&
        !payload.tomoAntibioticosUltimos7d &&
        !payload.embarazadaOLactando &&
        !payload.tuvoTatuajeOPiercing &&
        !payload.tuvoCirugiaReciente;

      setResult({
        success: true,
        data: { esApto, status: esApto ? 'APTO' : 'NO_APTO' },
        message: esApto
          ? 'Evaluación preliminar: APTO para donar sangre.'
          : 'Evaluación preliminar: No cumples con los criterios para donar hoy.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setStep(1);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Triage Médico Donante</Text>
        <Text style={styles.headerSubtitle}>Cuestionario de elegibilidad y evaluación clínica</Text>

        {/* Tabs switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'new' && styles.tabBtnActive]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'new' && styles.tabBtnTextActive]}>
              Nuevo Triage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'history' && styles.tabBtnTextActive]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'history' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {loadingHistory ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#D42040" />
              <Text style={styles.loadingText}>Cargando historial...</Text>
            </View>
          ) : historyError ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
              <Text style={styles.errorText}>{historyError}</Text>
            </View>
          ) : history.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="clipboard-outline" size={54} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Sin evaluaciones registradas</Text>
              <Text style={styles.emptySub}>Completa tu primer cuestionario de triage para registrar tu estado.</Text>
            </View>
          ) : (
            history.map((item, index) => {
              const isEligible = item.esApto ?? item.isEligible ?? true;
              return (
                <View key={item._id || index} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <Ionicons
                      name={isEligible ? 'checkmark-circle' : 'close-circle'}
                      size={28}
                      color={isEligible ? '#16A34A' : '#DC2626'}
                    />
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyStatus}>
                        {isEligible ? 'Elegible para Donación' : 'No Elegible'}
                      </Text>
                      <Text style={styles.historyDate}>
                        {item.createdAt || item.fecha || 'Fecha registrada'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      ) : result ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.resultCard, result.data?.esApto !== false ? styles.resultSuccess : styles.resultWarning]}>
            <Ionicons
              name={result.data?.esApto !== false ? 'checkmark-circle' : 'alert-circle'}
              size={64}
              color={result.data?.esApto !== false ? '#16A34A' : '#D97706'}
            />
            <Text style={styles.resultTitle}>
              {result.data?.esApto !== false ? '¡Eres Apto para Donar!' : 'Evaluación Completada'}
            </Text>
            <Text style={styles.resultSub}>{result.message}</Text>

            <TouchableOpacity style={styles.resetBtn} onPress={handleResetForm}>
              <Text style={styles.resetBtnText}>Realizar Nuevo Triage</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Progress Indicator */}
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperStepText}>Paso {step} de 3</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(step / 3) * 100}%` }]} />
            </View>
          </View>

          {/* STEP 1: Signos Vitales */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Paso 1: Signos Vitales y Biometría</Text>
              <Text style={styles.stepSubtitle}>Ingresa tus mediciones clínicas actuales</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Edad (Años) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ej. 25"
                  value={formData.edadAnios}
                  onChangeText={(val) => handleChangeField('edadAnios', val)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso (Kg) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ej. 70"
                  value={formData.pesoKg}
                  onChangeText={(val) => handleChangeField('pesoKg', val)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pulso (BPM) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ej. 75"
                  value={formData.pulsoBpm}
                  onChangeText={(val) => handleChangeField('pulsoBpm', val)}
                />
              </View>

              <View style={styles.rowTwo}>
                <View style={[styles.inputGroup, { flex: 0.48 }]}>
                  <Text style={styles.label}>P. Sistólica (mmHg) *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="120"
                    value={formData.presionSistolicaMmHg}
                    onChangeText={(val) => handleChangeField('presionSistolicaMmHg', val)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 0.48 }]}>
                  <Text style={styles.label}>P. Diastólica (mmHg) *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="80"
                    value={formData.presionDiastolicaMmHg}
                    onChangeText={(val) => handleChangeField('presionDiastolicaMmHg', val)}
                  />
                </View>
              </View>

              <View style={styles.rowTwo}>
                <View style={[styles.inputGroup, { flex: 0.48 }]}>
                  <Text style={styles.label}>Temperatura (°C) *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="36.5"
                    value={formData.temperaturaC}
                    onChangeText={(val) => handleChangeField('temperaturaC', val)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 0.48 }]}>
                  <Text style={styles.label}>Hemoglobina (g/dL) *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="14.2"
                    value={formData.hemoglobinaGdl}
                    onChangeText={(val) => handleChangeField('hemoglobinaGdl', val)}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: Infecciones y Salud */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Paso 2: Infecciones y Salud General</Text>
              <Text style={styles.stepSubtitle}>Responde con precisión a las siguientes preguntas</Text>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Tienes o has tenido fiebre en los últimos días?</Text>
                </View>
                <Switch
                  value={formData.tieneFiebre}
                  onValueChange={(val) => handleChangeField('tieneFiebre', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.tieneFiebre ? '#D42040' : '#F8FAFC'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Presentas síntomas de infección activa (tos, dolor, etc.)?</Text>
                </View>
                <Switch
                  value={formData.tieneSintomasInfeccion}
                  onValueChange={(val) => handleChangeField('tieneSintomasInfeccion', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.tieneSintomasInfeccion ? '#D42040' : '#F8FAFC'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Padeces alguna enfermedad crónica?</Text>
                </View>
                <Switch
                  value={formData.tieneEnfermedadCronica}
                  onValueChange={(val) => handleChangeField('tieneEnfermedadCronica', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.tieneEnfermedadCronica ? '#D42040' : '#F8FAFC'}
                />
              </View>

              {formData.tieneEnfermedadCronica && (
                <View style={styles.switchRow}>
                  <View style={styles.switchTextCol}>
                    <Text style={styles.switchLabel}>¿Tu enfermedad crónica se encuentra controlada?</Text>
                  </View>
                  <Switch
                    value={formData.enfermedadCronicaControlada}
                    onValueChange={(val) => handleChangeField('enfermedadCronicaControlada', val)}
                    trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                    thumbColor={formData.enfermedadCronicaControlada ? '#16A34A' : '#F8FAFC'}
                  />
                </View>
              )}
            </View>
          )}

          {/* STEP 3: Hábitos y Factores de Riesgo */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Paso 3: Hábitos y Factores de Riesgo</Text>
              <Text style={styles.stepSubtitle}>Último paso para determinar tu elegibilidad</Text>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Consumiste alcohol en las últimas 24 horas?</Text>
                </View>
                <Switch
                  value={formData.consumioAlcoholUltimas24h}
                  onValueChange={(val) => handleChangeField('consumioAlcoholUltimas24h', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.consumioAlcoholUltimas24h ? '#D42040' : '#F8FAFC'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Has tomado antibióticos en los últimos 7 días?</Text>
                </View>
                <Switch
                  value={formData.tomoAntibioticosUltimos7d}
                  onValueChange={(val) => handleChangeField('tomoAntibioticosUltimos7d', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.tomoAntibioticosUltimos7d ? '#D42040' : '#F8FAFC'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Estás embarazada o en periodo de lactancia?</Text>
                </View>
                <Switch
                  value={formData.embarazadaOLactando}
                  onValueChange={(val) => handleChangeField('embarazadaOLactando', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.embarazadaOLactando ? '#D42040' : '#F8FAFC'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Te has hecho un tatuaje o piercing recientemente?</Text>
                </View>
                <Switch
                  value={formData.tuvoTatuajeOPiercing}
                  onValueChange={(val) => handleChangeField('tuvoTatuajeOPiercing', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.tuvoTatuajeOPiercing ? '#D42040' : '#F8FAFC'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchLabel}>¿Tuviste alguna cirugía o procedimiento reciente?</Text>
                </View>
                <Switch
                  value={formData.tuvoCirugiaReciente}
                  onValueChange={(val) => handleChangeField('tuvoCirugiaReciente', val)}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={formData.tuvoCirugiaReciente ? '#D42040' : '#F8FAFC'}
                />
              </View>
            </View>
          )}

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
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    marginTop: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#D42040',
  },
  tabBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
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
  stepContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
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
  resultCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  resultSuccess: {
    backgroundColor: '#DCFCE7',
  },
  resultWarning: {
    backgroundColor: '#FEF3C7',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  resultSub: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  resetBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  resetBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    marginLeft: 12,
  },
  historyStatus: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  historyDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
