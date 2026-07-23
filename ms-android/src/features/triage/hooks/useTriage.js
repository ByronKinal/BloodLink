import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as triageApi from '../api/triage.api';

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

export function useTriage() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const fetchTriageHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await triageApi.getTriageHistory();
      const data = res.data?.data || res.data;
      setHistory(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.log('Error fetching triage history:', err?.message);
      setHistoryError('No se pudo cargar el historial de triage.');
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchTriageHistory();
    }
  }, [activeTab, fetchTriageHistory]);

  const handleChangeField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      const response = await triageApi.submitTriage(payload);
      const resData = response.data?.data || response.data;
      setResult({
        success: true,
        data: resData,
        message: resData?.message || 'Triage médico enviado con éxito.',
      });
    } catch (err) {
      console.log('Error submitting triage:', err?.message);
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

  return {
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
    refetchHistory: fetchTriageHistory,
  };
}
