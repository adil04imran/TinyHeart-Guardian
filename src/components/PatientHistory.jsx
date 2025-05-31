import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const PatientHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [timeFilter, setTimeFilter] = useState('all');
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchPatientHistory();
  }, [patientId, page, timeFilter]);

  const fetchPatientHistory = async () => {
    setLoading(true);
    try {
      // Real API call
      const response = await axios.get(
        `${API_URL}/patients/${patientId}/history?page=${page}&page_size=${pageSize}&time_filter=${timeFilter}`
      );
      
      setPatientHistory(response.data);
      setTotalRecords(response.data.total_records);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patient history: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching patient history:', err);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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

  const handleBack = () => {
    navigate('/');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Calculate total pages
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Prepare data for chart - use all history records for the chart
  const prepareChartData = () => {
    if (!patientHistory || !patientHistory.history) return [];
    
    return patientHistory.history
      .map(item => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk: item.risk_score
      }))
      .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  };

  // Custom tooltip formatter that safely handles undefined items
  const customLabelFormatter = (label, items) => {
    if (items && items.length > 0 && items[0].payload) {
      return `${items[0].payload.date} ${label}`;
    }
    return label;
  };

  if (loading && !patientHistory) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !patientHistory) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Patient {patientId} History
        </Typography>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="time-filter-label">Time Range</InputLabel>
          <Select
            labelId="time-filter-label"
            value={timeFilter}
            label="Time Range"
            onChange={handleTimeFilterChange}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {patientHistory && patientHistory.history && (
        <>
          {/* Risk Score Trend Chart */}
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Risk Score Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  domain={[0, 1]} 
                  label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Risk Score']}
                  labelFormatter={customLabelFormatter}
                />
                <ReferenceLine y={0.4} stroke="#fbc02d" strokeDasharray="3 3" label="Moderate" />
                <ReferenceLine y={0.6} stroke="#f57c00" strokeDasharray="3 3" label="High" />
                <ReferenceLine y={0.8} stroke="#d32f2f" strokeDasharray="3 3" label="Critical" />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Prediction History Table */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Prediction History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {patientHistory.history.length} of {totalRecords} records
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Risk Score</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell>Alert Status</TableCell>
                    <TableCell>Explanation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientHistory.history.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(record.timestamp)}</TableCell>
                      <TableCell>{(record.risk_score * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <Chip 
                          label={getRiskLevelText(record.risk_score)} 
                          size="small"
                          sx={{ 
                            backgroundColor: getRiskLevelColor(record.risk_score),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {record.alert_triggered ? (
                          <Chip label="Alert Sent" size="small" color="error" />
                        ) : (
                          <Chip label="No Alert" size="small" color="default" />
                        )}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {record.explanation || "No explanation available"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handleChangePage} 
                  color="primary" 
                />
              </Box>
            )}
          </Paper>

          {/* Latest Prediction Details */}
          {patientHistory.history.length > 0 && (
            <Card elevation={4} sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Prediction Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Risk Level:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: getRiskLevelColor(patientHistory.history[0].risk_score),
                      fontWeight: 'bold'
                    }}
                  >
                    {getRiskLevelText(patientHistory.history[0].risk_score)} ({(patientHistory.history[0].risk_score * 100).toFixed(1)}%)
                  </Typography>
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Date & Time:</strong> {formatDate(patientHistory.history[0].timestamp)}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Alert Status:</strong> {patientHistory.history[0].alert_triggered ? 'Alert Triggered' : 'No Alert Needed'}
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Explanation:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {patientHistory.history[0].explanation || "No explanation available"}
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default PatientHistory;