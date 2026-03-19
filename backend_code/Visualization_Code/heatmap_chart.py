import pandas as pd                      # For data loading and manipulation
import plotly.express as px              # For creating interactive heatmaps
import os                                # For file and directory operations
from difflib import get_close_matches    # For fuzzy string matching
from collections import Counter          # For counting repeated keywords

# List of curated agricultural/development keywords
GOOD_KEYWORDS = [
    "agriculture", "climate change", "soil", "crop", "farmer", "irrigation", "yield", "resilience", "pesticide",
    "food security", "gender", "sustainability", "fertilizer", "drought", "farming systems", "smallholder",
    "rainfall", "carbon", "ecosystem", "nutrition", "biodiversity", "income", "market access", "land use",
    "subsidy", "rural development", "organic farming", "mechanization", "plant disease", "livestock", "carbon footprint",
    "supply chain", "seed", "agroforestry", "technology", "precision agriculture", "genetics", "GMOs", "pollination",
    "aquaculture", "water stress", "crop diversification", "microfinance", "access to credit", "education", "deforestation",
    "population growth", "renewable energy", "solar irrigation", "malnutrition", "migration", "urban agriculture",
    "labor", "income stabilization", "farm size", "training", "insurance", "weather forecasting", "global warming",
    "conflict", "policy", "cooperative", "digital tools", "climate finance", "land tenure", "crop insurance",
    "food systems", "pest management", "climate adaptation", "remittances", "data collection", "machine learning",
    "youth in agriculture", "women in agriculture", "health", "investment", "afforestation", "sub-Saharan Africa",
    "southeast Asia", "water harvesting", "crop modeling", "extension services", "soil salinity", "monitoring",
    "value chains", "sustainable intensification", "greenhouse gases", "input costs", "climate-smart ag",
    "plant breeding", "policy reform", "co-design", "conservation", "climate policy", "indigenous knowledge",
    "water availability", "technology adoption", "knowledge transfer", "disease outbreaks", "crop calendar"
]

# Generic keywords that tend to be too broad to add insight in the heatmap
BORING_KEYWORDS = {
    "crop", "farmer", "agriculture", "soil", "yield", "technology", "investment", "health",
    "education", "training", "monitoring", "data collection"
}

# Match a keyword to the closest keyword from GOOD_KEYWORDS using fuzzy logic
def match_keyword(word):
    match = get_close_matches(str(word).lower(), GOOD_KEYWORDS, n=1, cutoff=0.6)
    return match[0] if match else None

# Helper to create a short interpretation sentence for a topic
def build_topic_interpretation(topic_name, keyword_list):
    if not keyword_list:
        return f"{topic_name} does not have enough distinctive mapped keywords to summarize clearly."

    if len(keyword_list) == 1:
        return f"{topic_name} is primarily defined by {keyword_list[0]}."
    elif len(keyword_list) == 2:
        return f"{topic_name} is mainly characterized by {keyword_list[0]} and {keyword_list[1]}."
    else:
        return f"{topic_name} is most strongly associated with {keyword_list[0]}, {keyword_list[1]}, and {keyword_list[2]}."

# Main function
def create_heatmap(file_path, output_folder, top_n_topics=6, keywords_per_topic=4):
    df = pd.read_csv(file_path)

    # Ensure required columns are present
    if "Summary topic" not in df.columns or "Keywords" not in df.columns:
        print("The file must contain 'Summary topic' and 'Keywords' columns.")
        return

    # Clean core columns
    df = df.dropna(subset=["Summary topic"])
    df["Summary topic"] = df["Summary topic"].astype(str).str.strip()
    df["Keywords"] = df["Keywords"].astype(str)

    # Split and explode keywords
    df["Keywords"] = df["Keywords"].str.split(";")
    df_exploded = df.explode("Keywords")
    df_exploded["Keywords"] = df_exploded["Keywords"].astype(str).str.strip().str.lower()

    # Remove blanks
    df_exploded = df_exploded[
        (df_exploded["Keywords"] != "") &
        (df_exploded["Keywords"] != "nan")
    ]

    # Map keywords
    df_exploded["Mapped Keyword"] = df_exploded["Keywords"].apply(match_keyword)
    df_exploded = df_exploded.dropna(subset=["Mapped Keyword"])

    # Remove generic keywords
    df_exploded = df_exploded[~df_exploded["Mapped Keyword"].isin(BORING_KEYWORDS)]

    if df_exploded.empty:
        print("No useful mapped keywords were found after filtering, so the heatmap could not be created.")
        return

    # Keep top topics
    top_topics = df_exploded["Summary topic"].value_counts().head(top_n_topics).index.tolist()
    filtered_df = df_exploded[df_exploded["Summary topic"].isin(top_topics)].copy()

    if filtered_df.empty:
        print("No data remained after filtering to the top topics.")
        return

    # Count keyword usage by topic
    topic_keyword_counts = (
        filtered_df.groupby(["Summary topic", "Mapped Keyword"])
        .size()
        .reset_index(name="Count")
    )

    # Compute distinctiveness score:
    # score = keyword count in this topic / total count of this keyword across all selected topics
    keyword_totals = topic_keyword_counts.groupby("Mapped Keyword")["Count"].sum().to_dict()
    topic_keyword_counts["Distinctiveness"] = topic_keyword_counts.apply(
        lambda row: row["Count"] / keyword_totals[row["Mapped Keyword"]] if keyword_totals[row["Mapped Keyword"]] > 0 else 0,
        axis=1
    )

    # For each topic, keep the most distinctive keywords
    selected_rows = []
    topic_summaries = {}

    for topic in top_topics:
        topic_df = topic_keyword_counts[topic_keyword_counts["Summary topic"] == topic].copy()
        topic_df = topic_df.sort_values(["Distinctiveness", "Count"], ascending=[False, False]).head(keywords_per_topic)
        selected_rows.append(topic_df)

        top_keywords = topic_df["Mapped Keyword"].tolist()
        topic_summaries[topic] = top_keywords

    if not selected_rows:
        print("No topic-keyword rows were selected for the heatmap.")
        return

    selected_df = pd.concat(selected_rows, ignore_index=True)

    # Build pivot table using raw counts first
    heatmap_counts = (
        selected_df.pivot(index="Summary topic", columns="Mapped Keyword", values="Count")
        .fillna(0)
    )

    # Normalize each row so users compare within a topic
    heatmap_normalized = heatmap_counts.div(heatmap_counts.sum(axis=1), axis=0).fillna(0)

    # Reorder rows and columns
    heatmap_normalized = heatmap_normalized.loc[
        heatmap_normalized.sum(axis=1).sort_values(ascending=False).index,
        heatmap_normalized.sum(axis=0).sort_values(ascending=False).index
    ]

    # Create annotation text as percentages
    annotation_text = heatmap_normalized.applymap(lambda x: f"{x:.0%}" if x > 0 else "")

    # Build the heatmap
    fig = px.imshow(
        heatmap_normalized,
        text_auto=False,
        aspect="auto",
        labels=dict(x="Keyword", y="Summary Topic", color="Share Within Topic"),
        title="Heatmap of Summary Topics and Their Most Distinctive Keywords"
    )

    # Add custom text labels
    fig.update_traces(
        text=annotation_text.values,
        texttemplate="%{text}",
        hovertemplate="<b>Topic:</b> %{y}<br><b>Keyword:</b> %{x}<br><b>Share within topic:</b> %{z:.2%}<extra></extra>"
    )

    fig.update_layout(
        title_font_size=26,
        font=dict(size=14),
        title_x=0.5,
        width=1450,
        height=850,
        xaxis_tickangle=40,
        margin=dict(t=90, l=40, r=40, b=40)
    )

    # Build interpretation content
    topic_cards_html = ""
    for topic, keywords in topic_summaries.items():
        interpretation = build_topic_interpretation(topic, keywords)
        keyword_string = ", ".join(keywords) if keywords else "No clear keywords found"
        topic_cards_html += f"""
        <div class="topic-card">
            <h3>{topic}</h3>
            <p><strong>Top distinctive keywords:</strong> {keyword_string}</p>
            <p>{interpretation}</p>
        </div>
        """

    # Cross-topic observations
    keyword_frequency = Counter()
    for keywords in topic_summaries.values():
        keyword_frequency.update(set(keywords))

    shared_keywords = [kw for kw, count in keyword_frequency.items() if count >= 2]
    unique_topic_count = sum(1 for kws in topic_summaries.values() if len(kws) <= 2)

    shared_keywords_text = ", ".join(shared_keywords[:10]) if shared_keywords else "No strong shared bridge keywords stood out across the selected topics."

    key_patterns_html = f"""
    <ul>
        <li>This heatmap uses <strong>normalized values</strong>, so each row shows which keywords matter most <em>within that topic</em>, not just which topic has more papers.</li>
        <li>Only the <strong>most distinctive keywords per topic</strong> are shown, making the chart more useful for identifying what defines each research area.</li>
        <li><strong>Shared keywords across multiple topics:</strong> {shared_keywords_text}</li>
        <li><strong>More specialized topics:</strong> {unique_topic_count} topic(s) appear to have a narrower keyword profile, suggesting a more focused sub-area of the literature.</li>
    </ul>
    """

    what_this_shows_html = """
    <p>
        This heatmap highlights the most distinctive mapped keywords associated with each summary topic.
        Darker cells indicate that a keyword makes up a larger share of that topic’s selected keyword profile.
        Instead of using broad keywords or raw counts alone, this version emphasizes the terms that best
        differentiate one topic from another.
    </p>
    <p>
        Researchers can use this view to quickly identify what defines each topic, where themes overlap,
        and which areas appear more specialized or more interconnected across the literature.
    </p>
    """

    # Convert Plotly figure to HTML fragment
    plot_html = fig.to_html(full_html=False, include_plotlyjs="cdn")

    # Full HTML page
    full_html = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Heatmap of Summary Topics and Keywords</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f7f7f7;
                color: #222;
            }}
            .container {{
                width: 94%;
                margin: 0 auto;
                padding: 30px 0 60px 0;
            }}
            .section {{
                background: white;
                margin-top: 24px;
                padding: 24px 28px;
                border-radius: 16px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            }}
            h1 {{
                text-align: center;
                margin-top: 10px;
                margin-bottom: 10px;
                font-size: 32px;
            }}
            h2 {{
                margin-top: 0;
                font-size: 24px;
            }}
            p, li {{
                font-size: 17px;
                line-height: 1.6;
            }}
            .topic-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 18px;
            }}
            .topic-card {{
                background: #fafafa;
                border: 1px solid #e2e2e2;
                border-radius: 14px;
                padding: 18px;
            }}
            .topic-card h3 {{
                margin-top: 0;
                font-size: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Heatmap of Summary Topics and Keywords</h1>

            <div class="section">
                {plot_html}
            </div>

            <div class="section">
                <h2>What This Shows</h2>
                {what_this_shows_html}
            </div>

            <div class="section">
                <h2>Key Patterns</h2>
                {key_patterns_html}
            </div>

            <div class="section">
                <h2>Topic-by-Topic Summaries</h2>
                <div class="topic-grid">
                    {topic_cards_html}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    # Ensure output folder exists
    vis_folder = os.path.join(output_folder, "Visualizations")
    os.makedirs(vis_folder, exist_ok=True)

    output_file = os.path.join(
        vis_folder,
        f"heatmap_{os.path.basename(file_path).replace('.csv', '')}.html"
    )

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(full_html)

    print(f"🔥 Heatmap with summary page saved to '{output_file}'")