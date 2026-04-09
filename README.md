🏠 Real Estate Price Prediction Web Application
📌 Project Overview

This project is an end-to-end Machine Learning web application that predicts real estate prices based on user inputs such as square footage, number of bedrooms, bathrooms, and location.

The project demonstrates the complete data science workflow, from data preprocessing and model training to deploying the model using a Flask API and building an interactive frontend using React.

The model is trained using the Bangalore House Price dataset and predicts property prices based on various features.

🧠 Machine Learning Workflow

The following steps were performed during model development:

Data Loading
Loaded Bangalore housing dataset using Pandas.
Data Cleaning
Removed missing values
Standardized columns
Feature Engineering
Converted categorical data (location) using one-hot encoding
Created new useful features
Outlier Detection & Removal
Removed unrealistic price per square foot values.
Dimensionality Reduction
Reduced number of locations by grouping low-frequency locations.
Model Building
Used Linear Regression from Scikit-learn.
Model Optimization
Applied GridSearchCV to find the best model parameters.
Model Evaluation
Used K-Fold Cross Validation to evaluate performance.
Model Export
Saved trained model using pickle.

🏗️ System Architecture
User (React Frontend)
        │
        ▼
Flask API Server
        │
        ▼
Machine Learning Model
        │
        ▼
Predicted House Price

💻 Technologies Used
Programming Language
Python
Data Science Libraries
NumPy
Pandas
Matplotlib
Scikit-learn
Backend
Flask
Frontend
React
Tailwind CSS
JavaScript
HTML
Development Tools
Jupyter Notebook
Visual Studio Code
Git & GitHub

📊 Dataset

Dataset used in this project:

Bangalore House Price Dataset from Kaggle

Dataset Link:
https://www.kaggle.com/datasets/amitabhajoy/bengaluru-house-price-data

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/yourusername/real-estate-price-prediction.git

2️⃣ Navigate to Project Folder
cd real-estate-price-prediction

3️⃣ Install Python Dependencies
pip install -r requirements.txt

4️⃣ Start Flask Server
python server.py
Server will start at:
http://127.0.0.1:5000

5️⃣ Start React Frontend
Navigate to frontend folder:

cd client
npm install
npm start

Frontend will run at:
http://localhost:3000

📂 Project Structure
Real-Estate-Price-Prediction
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── server.py
│   ├── util.py
│   ├── artifacts
│   │   ├── model.pickle
│   │   └── columns.json
│
├── model
│   └── real_estate_model.ipynb
│
├── requirements.txt
└── README.md

📈 Features

✔ Predict house prices instantly
✔ Machine learning powered predictions
✔ Interactive web interface
✔ REST API using Flask
✔ Real-time predictions from frontend

📌 Example Prediction

Input:

Area: 1200 sq ft
Bedrooms: 2
Bathrooms: 2
Location: Indira Nagar

Output:

Predicted Price: ₹95 Lakhs (Example)
