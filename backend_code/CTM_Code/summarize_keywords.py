import pandas as pd  # For working with dataframes and CSV files
from sklearn.feature_extraction.text import TfidfVectorizer  # Converts text into numeric vectors
from sklearn.metrics.pairwise import cosine_similarity  # Measures similarity between two sets of vectors

# Define a dictionary to expand stemmed/abbreviated keywords into full meaningful terms
KEYWORD_EXPANSIONS = {
    "genet": "genetics", "gene_express": "gene expression", "obes": "obesity",
    "mutat": "mutation", "studi": "", "activ": "activation", "makeup": "",
    "use": "", "can": "", "system": "", "type": "", "develop": "development",
    "differ": "differentiation", "transcript": "transcription", "express": "expression",
    "yield": "crop yield", "fertil": "fertilizer", "irrig": "irrigation",
    "soil_moistur": "soil moisture", "crop_prod": "crop production",
    "resilienc": "resilience", "adapt": "adaptation", "sustain": "sustainability",
    "increas": "increase", "reduc": "reduction", "food_sec": "food security",
    "temperatur": "temperature", "precipit": "precipitation", "agricultur": "agriculture",
    "studi": "study", "analys": "analysis", "maiz": "maize"
}

# These are generic, vague keywords that should be removed
FILLER_WORDS = {
    "use", "study", "system", "data", "based", "approach",
    "result", "analysis", "method", "effect"
}

def clean_keywords(raw_keywords):
    """
    Cleans a string of semicolon-separated keywords by:
    - Lowercasing
    - Stripping whitespace
    - Expanding stemmed terms
    - Removing filler/empty tokens
    """
    tokens = [k.strip().lower() for k in raw_keywords.split(";")]
    expanded = []
    for t in tokens:
        if t in FILLER_WORDS or t == "":
            continue  # Skip irrelevant or empty keywords
        if t in KEYWORD_EXPANSIONS:
            new_term = KEYWORD_EXPANSIONS[t]
            if new_term:  # Only add if not mapped to empty string
                expanded.append(new_term)
        else:
            expanded.append(t)  # If not expandable, keep original
    return " ".join(expanded)  # Join keywords with space for TF-IDF input

# A list of predefined topics to assign based on keyword similarity
AGRI_TOPICS = [
    "Parkinson’s Early Detection", "Voice-Based Diagnostics", "Telehealth Accessibility", "Remote Patient Monitoring",
    "Chronic Disease Management", "Emergency Care Triage", "AI Clinical Decision Support",
    "Medical Imaging Analysis", "Cancer Early Screening", "Genomic Medicine Applications",
    "Personalized Treatment Planning", "Health Data Interoperability", "Electronic Medical Records Optimization",
    "Predictive Risk Modeling", "Digital Therapeutics", "Mobile Health Applications", "Wearable Health Tracking",
    "Medication Adherence Tools", "Pharmacogenomics", "Health Data Privacy", "Biometric Authentication in Health",
    "Mental Health Services Access", "Behavioral Health Integration", "Substance Use Treatment Models",
    "Maternal Health Outcomes", "Neonatal Care Quality", "Pediatric Health Interventions",
    "Nutrition and Chronic Illness", "Obesity Prevention Strategies", "Diabetes Prevention Programs",
    "Hypertension Management", "Cardiovascular Risk Assessment", "Stroke Prevention Strategies",
    "Pain Management Approaches", "Palliative and End-of-Life Care", "Elderly Care Services",
    "Fall Risk Screening", "Rehabilitation Robotics", "Surgical Robotics", "Infection Prevention and Control",
    "Hospital-Acquired Infections", "Antibiotic Resistance Monitoring", "Vaccine Coverage Improvement",
    "Public Health Surveillance Systems", "Disease Outbreak Forecasting", "Air Quality and Health Impacts",
    "Environmental Health Risks", "Health Equity and Access", "Rural Health System Strengthening",
    "Urban Health Challenges", "Health Insurance Coverage", "Healthcare Affordability Strategies",
    "Primary Care Strengthening", "Care Coordination Models", "Integrated Care Pathways",
    "Hospital Readmission Reduction", "Patient Engagement Tools", "Patient Education Strategies",
    "Preventive Screening Programs", "Lifestyle Medicine Interventions", "Nutrition Counseling Services",
    "Sleep Health Monitoring", "Digital Mental Health", "AI in Radiology", "Clinical Workflow Automation",
    "Medical Error Reduction", "Diagnostic Accuracy Improvement", "Bioethics in Healthcare",
    "Health Workforce Training", "Nursing Workforce Retention", "Provider Burnout Prevention",
    "Healthcare Supply Chain Management", "Pharmaceutical Supply Chains", "Cold Chain Management",
    "Telepharmacy Services", "Mobile Clinics and Outreach", "Women’s Health Services",
    "Reproductive Health Access", "Sexual Health Education", "Infectious Disease Modeling",
    "Health Communication Strategies", "Community Health Programs", "School-Based Health Services",
    "Global Health Partnerships", "Humanitarian Medical Response", "Disaster Health Preparedness",
    "Climate Change and Health", "Heat-Related Illness Prevention", "Vector-Borne Disease Control",
    "Water, Sanitation, and Hygiene", "Health Literacy Improvement", "Precision Public Health",
    "Big Data in Healthcare", "AI-Assisted Drug Discovery", "Clinical Trial Optimization",
    "Pharmacovigilance Systems", "Long-Term Care Models", "Digital Health Policy",
    "Healthcare Quality Metrics", "Value-Based Care Models", "Home-Based Care Services",
    "Wearable Cardiac Monitoring", "Respiratory Health Management", "Chronic Pain Digital Management",
    "Neurodegenerative Disease Research", "Autoimmune Disease Treatment Innovations"
]

def generate_summary_topics(input_file, output_file):
    # Read the input CSV into a DataFrame
    df = pd.read_csv(input_file)
    
    # Replace missing keyword entries with empty strings
    df["Keywords"] = df["Keywords"].fillna("")
    
    # Apply the cleaning function to each row's keywords
    cleaned_keywords = df["Keywords"].apply(clean_keywords)

    # Combine cleaned keywords and the predefined AGRI_TOPICS into one list
    all_texts = cleaned_keywords.tolist() + AGRI_TOPICS

    # Vectorize the text using TF-IDF (turns text into numerical representation)
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Slice the TF-IDF matrix into two parts:
    keyword_vecs = tfidf_matrix[:len(df)]   # Rows representing input rows
    topic_vecs = tfidf_matrix[len(df):]     # Rows representing AGRI_TOPICS

    # Compute cosine similarity between each row and every predefined topic
    sim_matrix = cosine_similarity(keyword_vecs, topic_vecs)

    assigned_topics = set()  # Keep track of topics already used
    summary_topics = []      # Final list of assigned topics

    # Loop through each row's similarity vector
    for row_sim in sim_matrix:
        sorted_indices = row_sim.argsort()[::-1]  # Sort indices by highest similarity
        for idx in sorted_indices:
            topic = AGRI_TOPICS[idx]
            if topic not in assigned_topics:
                # Assign topic only if it hasn’t been used before
                assigned_topics.add(topic)
                summary_topics.append(topic)
                break
        else:
            # If all top topics were used, assign "Unlabeled"
            summary_topics.append("Unlabeled")

    # Add the result to the DataFrame
    df["Summary topic"] = summary_topics

    # Save the final DataFrame to a CSV
    df.to_csv(output_file, index=False)
    return output_file  # Return the file path in case the function is reused
