# topic_keyword_sankey.py
import os
import pandas as pd
import plotly.graph_objects as go
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CLEAN_KEYWORDS = [
    "food security", "crop yield", "soil health", "irrigation", "climate change", "drought resilience",
    "smallholder farming", "women in agriculture", "sustainable farming", "pesticide use", "nutrition access",
    "farm financing", "livestock management", "seed quality", "organic agriculture", "soil erosion",
    "farming practices", "agribusiness growth", "water access", "plant breeding", "GMO crops",
    "gender equity", "agricultural policy", "technology use", "income diversification",
    "agricultural training", "education access", "market access", "land tenure", "rural development",
    "crop rotation", "precision agriculture", "food systems", "international trade", "carbon emissions",
    "greenhouse gases", "rainfall variability", "resilient communities", "agroecology", "carbon sequestration",
    "subsidy reform", "price volatility", "poverty reduction", "malnutrition reduction", "crop loss prevention",
    "remote sensing", "data-driven farming", "climate adaptation", "weather forecasting", "supply chain resilience",
    "farm labor", "access to credit", "fertilizer use", "post-harvest losses", "food distribution systems",
    "income inequality", "water management", "plant health", "youth in farming", "land use efficiency",
    "crop diversification", "migration patterns", "urban-rural linkages", "climate resilience", "ecosystem services",
    "public health", "biodiversity loss", "soil monitoring", "animal health", "technology training",
    "digital agriculture", "policy advocacy", "financial literacy", "value chain development", "agriculture education",
    "insurance schemes", "food access equity", "biofuel production", "economic upliftment", "skills training",
    "capacity building", "crop science", "pest management", "urban agriculture", "market intelligence",
    "investment in ag", "women’s empowerment", "climate mitigation", "crop diseases", "pollution control",
    "clean technologies", "mobile extension", "farm logistics", "aquaculture systems", "seasonal forecasting",
    "youth migration", "trade agreements", "nutrition programs", "healthcare access", "rural banking"
]

def get_best_match(raw_keyword: str) -> str:
    raw_keyword = str(raw_keyword).strip().lower()
    if not raw_keyword:
        return raw_keyword
    vectorizer = TfidfVectorizer().fit(CLEAN_KEYWORDS + [raw_keyword])
    vecs = vectorizer.transform([raw_keyword] + CLEAN_KEYWORDS)
    sims = cosine_similarity(vecs[0:1], vecs[1:]).flatten()
    return CLEAN_KEYWORDS[int(sims.argmax())]

def generate_topic_keyword_sankey(
    file_path: str,
    output_folder: str,
    top_topics: int = 6,
    top_keywords_per_topic: int = 6
) -> str:
    df = pd.read_csv(file_path)

    if "Summary topic" not in df.columns or "Keywords" not in df.columns:
        raise ValueError("CSV must contain 'Summary topic' and 'Keywords' columns.")

    df = df.dropna(subset=["Summary topic", "Keywords"])
    df["Summary topic"] = df["Summary topic"].astype(str).str.strip()

    # Explode keywords
    df["Keywords"] = df["Keywords"].astype(str).str.split(";")
    df_ex = df.explode("Keywords")
    df_ex["Keywords"] = df_ex["Keywords"].astype(str).str.strip().str.lower()
    df_ex = df_ex[df_ex["Keywords"] != ""]

    # Focus on the biggest topics first
    top_topic_list = df_ex["Summary topic"].value_counts().head(top_topics).index.tolist()
    df_ex = df_ex[df_ex["Summary topic"].isin(top_topic_list)].copy()

    # Normalize keywords
    df_ex["Cleaned Keyword"] = df_ex["Keywords"].apply(get_best_match)

    # Keep top K keywords per topic (to make Sankey readable)
    counts = (
        df_ex.groupby(["Summary topic", "Cleaned Keyword"])
        .size()
        .reset_index(name="Count")
        .sort_values(["Summary topic", "Count"], ascending=[True, False])
    )

    kept = []
    for t in top_topic_list:
        kept.append(counts[counts["Summary topic"] == t].head(top_keywords_per_topic))
    kept_df = pd.concat(kept, ignore_index=True)

    # Build Sankey nodes
    topics = top_topic_list
    keywords = sorted(kept_df["Cleaned Keyword"].unique().tolist())
    labels = topics + keywords

    idx = {label: i for i, label in enumerate(labels)}
    sources = kept_df["Summary topic"].map(idx).tolist()
    targets = kept_df["Cleaned Keyword"].map(idx).tolist()
    values = kept_df["Count"].tolist()

    fig = go.Figure(
        data=[
            go.Sankey(
                node=dict(label=labels, pad=18, thickness=16),
                link=dict(source=sources, target=targets, value=values),
            )
        ]
    )

    fig.update_layout(
        title="🌊 Topic → Keyword Sankey (Connections Across Publications)",
        margin=dict(l=20, r=20, t=60, b=20),
    )

    vis_folder = os.path.join(output_folder, "Visualizations")
    os.makedirs(vis_folder, exist_ok=True)
    out_file = os.path.join(
        vis_folder,
        f"topic_keyword_sankey_{os.path.basename(file_path).replace('.csv', '')}.html"
    )
    fig.write_html(out_file)
    print(f"🔀 Sankey saved to '{out_file}'")
    return out_file
