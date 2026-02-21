const illnessInfo = {
  Pneumonia: {
    description:
      "Pneumonia is an infection that inflames the air sacs in one or both lungs.",
    symptoms: [
      "Cough with phlegm",
      "Fever or chills",
      "Shortness of breath",
      "Chest pain"
    ],
    treatment:
      "Treatment depends on severity but often includes antibiotics, rest, and fluids."
  },

  Bronchiectasis: {
    description:
      "Bronchiectasis is a chronic condition where the airways become widened and scarred.",
    symptoms: ["Chronic cough", "Thick mucus", "Frequent infections"],
    treatment:
      "Airway clearance therapy, antibiotics, and inhaled bronchodilators."
  },

  Asthma: {
    description:
      "Asthma is a chronic inflammatory disease that narrows the airways.",
    symptoms: ["Wheezing", "Chest tightness", "Shortness of breath"],
    treatment: "Inhalers, bronchodilators, and avoiding triggers."
  },

  Bronchiolitis: {
    description:
      "Bronchiolitis is a viral infection that affects the small airways.",
    symptoms: ["Wheezing", "Rapid breathing", "Cough"],
    treatment: "Supportive care such as hydration and monitoring."
  },

  Bronchitis: {
    description:
      "Bronchitis is inflammation of the bronchial tubes, often due to infection.",
    symptoms: ["Cough", "Mucus", "Fatigue"],
    treatment: "Rest, fluids, and sometimes inhalers."
  },

  COPD: {
    description:
      "COPD is a chronic lung disease that obstructs airflow and worsens over time.",
    symptoms: ["Chronic cough", "Breathlessness", "Frequent infections"],
    treatment: "Inhalers, oxygen therapy, and pulmonary rehab."
  },

  "Heart failure": {
    description:
      "Heart failure occurs when the heart cannot pump blood effectively.",
    symptoms: ["Shortness of breath", "Fatigue", "Swelling in legs"],
    treatment: "Medications, lifestyle changes, and monitoring."
  },

  "Lung fibrosis": {
    description:
      "Lung fibrosis causes scarring of lung tissue, making breathing difficult.",
    symptoms: ["Dry cough", "Shortness of breath", "Fatigue"],
    treatment: "Anti-fibrotic medications and oxygen therapy."
  },

  "Pleural effusion": {
    description:
      "Pleural effusion is fluid buildup between the lungs and chest wall.",
    symptoms: ["Chest pain", "Shortness of breath", "Dry cough"],
    treatment: "Drainage procedures and treating the underlying cause."
  }
};

export default illnessInfo;