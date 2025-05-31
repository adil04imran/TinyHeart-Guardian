import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  Paper,
  useTheme,
  alpha,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  People as PeopleIcon, 
  Warning as WarningIcon, 
  TrendingUp as TrendingUpIcon, 
  AccessTime as AccessTimeIcon,
  LocalHospital as HospitalIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';

// Custom StatCard Component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend, 
  subtitle,
  loading = false 
}) => {
  const theme = useTheme();
  const trendColor = trend > 0 ? 'error' : 'success';
  const trendText = trend > 0 ? `${trend}% Increase` : `${Math.abs(trend)}% Decrease`;

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.contrastText`,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Box mt={2} display="flex" alignItems="center">
          <TrendingUpIcon 
            color={trendColor} 
            sx={{ 
              transform: trend > 0 ? 'rotate(0deg)' : 'rotate(180deg)',
              mr: 0.5 
            }} 
          />
          <Typography variant="caption" color={trendColor}>
            {trendText}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Risk Badge Component
const RiskBadge = ({ risk, size = 'medium' }) => {
  const getRiskLevelColor = (risk) => {
    if (risk >= 0.8) return 'error';
    if (risk >= 0.6) return 'warning';
    if (risk >= 0.4) return 'info';
    return 'success';
  };

  const getRiskLevelText = (risk) => {
    if (risk >= 0.8) return 'CRITICAL';
    if (risk >= 0.6) return 'HIGH';
    if (risk >= 0.4) return 'MODERATE';
    return 'LOW';
  };

  return (
    <Chip 
      label={getRiskLevelText(risk)}
      color={getRiskLevelColor(risk)}
      size={size}
      icon={<WarningIcon />}
    />
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: { value: '1,247', change: 12.5 },
      highRiskPatients: { value: '87', change: 8.2 },
      avgResponseTime: { value: '2.5', change: -5.3 },
      predictionAccuracy: { value: '94.5%', change: 2.1 }
    },
    recentPredictions: [
      { id: 'P1001', risk_score: 0.85, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), alert_triggered: true },
      { id: 'P1002', risk_score: 0.45, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), alert_triggered: false },
      { id: 'P1003', risk_score: 0.72, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), alert_triggered: true },
      { id: 'P1004', risk_score: 0.35, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), alert_triggered: false },
      { id: 'P1005', risk_score: 0.91, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), alert_triggered: true }
    ],
    riskTrends: [
      { date: 'Mon', value: 0.65 },
      { date: 'Tue', value: 0.72 },
      { date: 'Wed', value: 0.58 },
      { date: 'Thu', value: 0.81 },
      { date: 'Fri', value: 0.69 },
      { date: 'Sat', value: 0.74 },
      { date: 'Sun', value: 0.62 }
    ],
    loading: false,
    error: null,
    timeRange: 'week',
    refreshing: false,
    activeChart: 'line',
    systemStatus: {
      model_status: 'Online',
      alert_system: 'Active'
    }
  });

  const handleRefresh = () => {
    setDashboardData(prev => ({ ...prev, refreshing: true }));
    // Simulate API call
    setTimeout(() => {
      setDashboardData(prev => ({ ...prev, refreshing: false }));
    }, 1000);
  };

  const handleViewHistory = (patientId) => {
    navigate(`/history/${patientId}`);
  };

  const handleNewPrediction = () => {
    navigate('/predict');
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const getRiskLevelColor = (score) => {
    if (score >= 0.8) return theme.palette.error.main;
    if (score >= 0.6) return theme.palette.warning.main;
    if (score >= 0.4) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  const getRiskLevelText = (score) => {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MODERATE';
    return 'LOW';
  };

  if (dashboardData.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (dashboardData.error) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="error" gutterBottom>{dashboardData.error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 0.5
          }}
        >
          Neonatal Risk Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="textSecondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={dashboardData.refreshing}
          >
            {dashboardData.refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Patients" 
            value={dashboardData.stats.totalPatients.value} 
            icon={<PeopleIcon />}
            color="primary"
            trend={dashboardData.stats.totalPatients.change}
            subtitle="+12 this week"
            loading={dashboardData.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="High Risk Cases" 
            value={dashboardData.stats.highRiskPatients.value} 
            icon={<WarningIcon />}
            color="error"
            trend={dashboardData.stats.highRiskPatients.change}
            subtitle="+5 this week"
            loading={dashboardData.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Avg. Response Time" 
            value={dashboardData.stats.avgResponseTime.value} 
            icon={<AccessTimeIcon />}
            color="info"
            trend={dashboardData.stats.avgResponseTime.change}
            subtitle="Faster than last week"
            loading={dashboardData.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Prediction Accuracy" 
            value={dashboardData.stats.predictionAccuracy.value} 
            icon={<TimelineIcon />}
            color="success"
            trend={dashboardData.stats.predictionAccuracy.change}
            subtitle="Based on 1,000+ cases"
            loading={dashboardData.loading}
          />
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>System Status</Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Model Status:</Typography>
                <Chip 
                  label={dashboardData.systemStatus.model_status} 
                  color="success" 
                  size="small"
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Alert System:</Typography>
                <Chip 
                  label={dashboardData.systemStatus.alert_system} 
                  color="success" 
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Risk Distribution</Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.riskTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill={theme.palette.primary.main} name="Risk Score" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Predictions */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Recent Predictions</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleNewPrediction}
              startIcon={<WarningIcon />}
            >
              New Assessment
            </Button>
          </Box>
          
          {dashboardData.recentPredictions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="textSecondary">
                No predictions available yet. Make a new prediction to see results here.
              </Typography>
            </Box>
          ) : (
            <Box>
              {dashboardData.recentPredictions.map((prediction, index) => (
                <Box key={prediction.id}>
                  {index > 0 && <Divider sx={{ my: 1 }} />}
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    py={1.5}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        Patient {prediction.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(prediction.timestamp)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <RiskBadge risk={prediction.risk_score} />
                      {prediction.alert_triggered && (
                        <Chip 
                          label="Alert Sent" 
                          color="error" 
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleViewHistory(prediction.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
