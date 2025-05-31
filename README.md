# TinyHeart Guardian: Newborn Cardiac Arrest Prediction System

<div align="center">
  <img src="public/logo192.png" alt="TinyHeart Guardian Logo" width="120" />
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![MUI](https://img.shields.io/badge/Material--UI-5.14.20-0081CB?logo=mui&logoColor=white)](https://mui.com/)

  A cutting-edge AI-powered platform for early detection and prediction of cardiac arrest in newborns, enabling timely medical intervention.
</div>

## 🌟 Features

- **Real-time Monitoring**: Track vital signs and risk factors in real-time
- **AI-Powered Predictions**: Advanced machine learning models for early detection
- **User-Friendly Dashboard**: Intuitive interface for healthcare professionals
- **Patient History**: Comprehensive records and trend analysis
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: Eye-friendly interface for all lighting conditions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adil04imran/TinyHeart-Guardian.git
   cd TinyHeart-Guardian
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in browser**
   The application will open automatically in your default browser at [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
.
├── cardiac-prediction-frontend/  # Frontend React application
│   ├── public/                   # Static files
│   └── src/                      # Frontend source code
│       ├── components/           # Reusable UI components
│       │   ├── Dashboard.jsx     # Main dashboard component
│       │   ├── Navigation.jsx    # Top navigation bar
│       │   ├── PatientForm.jsx   # Form for new patient data
│       │   └── PatientHistory.jsx # Patient history view
│       ├── context/              # React context providers
│       │   └── ThemeContext.js   # Theme management
│       ├── App.js                # Main application component
│       └── theme.js              # MUI theme configuration
│
├── models/                     # Trained ML models and scalers
│   ├── model.pkl               # Main prediction model
│   ├── online_model.pkl         # Online learning model
│   └── scaler.pkl              # Feature scaler
│
├── modules/                    # Backend modules
│   ├── alert_system.py         # Alert and notification system
│   ├── data_module.py          # Data handling and processing
│   ├── database_module.py      # Database operations
│   ├── model_training.py       # Model training utilities
│   ├── online_learning.py      # Online learning implementation
│   ├── preprocessing.py        # Data preprocessing
│   ├── rl_module.py           # Reinforcement learning components
│   └── xai_module.py          # Explainable AI utilities
│
├── tests/                     # Test files
│   ├── test_model_behaviour.py  # Model behavior tests
│   └── test_preprocessing.py    # Preprocessing tests
│
├── .env.example              # Example environment variables
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
└── requirements.txt           # Python dependencies
```

## 🎨 Theming

TinyHeart Guardian supports both light and dark modes. The theme can be toggled using the sun/moon icon in the top navigation bar.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the amazing UI components
- React for the frontend framework
- All the open-source libraries that made this project possible

## 📞 Contact

For any queries or support, please open an issue in the repository.

---

<div align="center">
  Made with ❤️ for healthier tomorrows
</div>
