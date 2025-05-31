import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Slider, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Define normal ranges for vital signs
const vitalRanges = {
  heart_rate: { min: 100, max: 160, unit: 'bpm' },
  oxygen_sat: { min: 95, max: 100, unit: '%' },
  blood_pressure: { min: 50, max: 70, unit: 'mmHg' },
  respiration_rate: { min: 30, max: 60, unit: 'breaths/min' }
};

const PatientForm = () => {
  const [patientData, setPatientData] = useState({
    patient_id: '',
    heart_rate: 120,
    oxygen_sat: 98,
    blood_pressure: 60,
    respiration_rate: 40
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value
    });
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setPatientData({
      ...patientData,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Send prediction request to the real API
      const response = await axios.post(`${API_URL}/predict`, patientData);
      setResult(response.data);
      console.log('Prediction result:', response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while making the prediction');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (score) => {
    if (score >= 0.8) return '#d32f2f'; // Critical - Red
    if (score >= 0.6) return '#f57c00'; // High - Orange
    if (score >= 0.4) return '#fbc02d'; // Moderate - Yellow
    return '#388e3c'; // Low - Green
  };

  const getRiskLevelText = (score) => {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MODERATE';
    return 'LOW';
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New Cardiac Risk Prediction
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient ID"
                name="patient_id"
                value={patientData.patient_id}
                onChange={handleInputChange}
                required
                helperText="Enter a unique identifier for the patient"
              />
            </Grid>
            
            {Object.entries(vitalRanges).map(([key, range]) => (
              <Grid item xs={12} key={key}>
                <Typography gutterBottom>
                  {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({range.unit})
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={patientData[key]}
                      onChange={handleSliderChange(key)}
                      min={key === 'oxygen_sat' ? 70 : Math.floor(range.min * 0.5)}
                      max={key === 'oxygen_sat' ? 100 : Math.ceil(range.max * 1.5)}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: range.min, label: `${range.min}` },
                        { value: range.max, label: `${range.max}` }
                      ]}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      name={key}
                      value={patientData[key]}
                      onChange={handleInputChange}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 80 }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary">
                  Normal range: {range.min} - {range.max} {range.unit}
                </Typography>
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Predict Risk'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Prediction Results
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                Risk Level:
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: getRiskLevelColor(result.risk_score),
                  fontWeight: 'bold'
                }}
              >
                {getRiskLevelText(result.risk_score)} ({(result.risk_score * 100).toFixed(1)}%)
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" gutterBottom>
              <strong>Alert Status:</strong> {result.alert_triggered ? 'Alert Triggered' : 'No Alert Needed'}
            </Typography>
            
            {result.explanation && (
              <>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Explanation:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {result.explanation}
                </Typography>
              </>
            )}
            
            {result.alert_triggered && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                An alert has been sent to the medical staff.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PatientForm;