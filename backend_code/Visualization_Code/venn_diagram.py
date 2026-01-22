import pandas as pd                      # For reading and handling CSV data
import plotly.graph_objects as go        # For creating interactive visualizations
import os                                # For file path and folder operations

# Generates a venn diagram
def generate_venn_diagram(file_path, output_folder):
    df = pd.read_csv(file_path)  # Read CSV file

    # Drop rows missing required columns
    df = df.dropna(subset=["Summary topic", "Keywords"])

    # Semicolon-separated keywords into one keyword per row
    df["Keywords"] = df["Keywords"].astype(str).str.split(";")
    df_exploded = df.explode("Keywords")
    df_exploded["Keywords"] = df_exploded["Keywords"].astype(str).str.strip().str.lower()
    df_exploded = df_exploded[df_exploded["Keywords"] != ""]

    # Get the top 5 topics (most common)
    top_topics = df_exploded["Summary topic"].value_counts().head(5).index.tolist()
    df_filtered = df_exploded[df_exploded["Summary topic"].isin(top_topics)].copy()

    # Build a keyword set and keyword frequency map for each topic
    topic_sets = {}
    topic_freqs = {}
    for topic in top_topics:
        subset = df_filtered[df_filtered["Summary topic"] == topic]
        topic_sets[topic] = set(subset["Keywords"].tolist())
        topic_freqs[topic] = subset["Keywords"].value_counts().to_dict()

    # Pick the biggest topic as the center circle
    center_topic = max(top_topics, key=lambda t: len(topic_sets[t]))
    ordered_topics = [center_topic] + [t for t in top_topics if t != center_topic]

    # Layout
    positions = [
        (0.52, 0.56),  # Center
        (0.28, 0.62),  # Top-left
        (0.78, 0.62),  # Top-right
        (0.24, 0.38),  # Bottom-left
        (0.70, 0.34)   # Bottom-right
    ]

    # Colors
    fills = [
        "rgba(99, 102, 241, 0.16)",   # Purple
        "rgba(34, 197, 94, 0.16)",    # Green
        "rgba(239, 68, 68, 0.16)",    # Red
        "rgba(59, 130, 246, 0.16)",   # Blue
        "rgba(249, 115, 22, 0.16)"    # Orange
    ]
    borders = [
        "rgba(99, 102, 241, 0.75)",
        "rgba(245, 158, 11, 0.75)",
        "rgba(239, 68, 68, 0.75)",
        "rgba(59, 130, 246, 0.75)",
        "rgba(249, 115, 22, 0.75)"
    ]

    # Keyword lists
    def format_keywords(items, max_items=250):
        items = sorted(list(items))
        if len(items) == 0:
            return "None"
        if len(items) <= max_items:
            return "<br>".join(items)
        return "<br>".join(items[:max_items]) + f"<br>… (+{len(items) - max_items} more)"

    # Find the most common keyword
    def top_keywords_by_freq(candidates, freq_map, k):
        scored = [(w, freq_map.get(w, 0)) for w in candidates]
        scored.sort(key=lambda x: x[1], reverse=True)
        return [w for w, _ in scored[:k]]

    # Create the plotly figure
    fig = go.Figure()

    fig.add_annotation(
        x=0.5, y=0.98, xref="paper", yref="paper",
        text="<b>Venn diagram</b>",
        showarrow=False,
        font=dict(size=18, color="rgba(0,0,0,0.55)")
    )
    fig.add_shape(
        type="line",
        xref="paper", yref="paper",
        x0=0.38, x1=0.62, y0=0.955, y1=0.955,
        line=dict(width=1, color="rgba(0,0,0,0.18)")
    )

    # Circle scaling
    sizes = [len(topic_sets[t]) for t in ordered_topics]
    max_size = max(sizes) if sizes else 1

    def radius(size):
        base = 0.20
        extra = 0.08 * (size / max_size) ** 0.5
        return base + extra

    # Build circle shapes
    shapes = []
    circle_meta = []  # (topic, x, y, r, index)

    for i, topic in enumerate(ordered_topics[:5]):
        x, y = positions[i]
        r = radius(len(topic_sets[topic]))
        circle_meta.append((topic, x, y, r, i))

        shapes.append(
            dict(
                type="circle",
                xref="paper", yref="paper",
                x0=x - r, y0=y - r,
                x1=x + r, y1=y + r,
                fillcolor=fills[i],
                line=dict(color=borders[i], width=2)
            )
        )

    fig.update_layout(shapes=shapes)

    # Add text inside circles
    for topic, x, y, r, i in circle_meta:
        this_set = topic_sets[topic]
        other_union = set().union(*[topic_sets[t] for t in ordered_topics if t != topic])

        # Unique keywords (difference) vs shared keywords (similarity)
        unique = this_set - other_union
        shared = this_set & other_union

        # Select the most common keywords to be the selected topic shown inside the circle
        top_unique = top_keywords_by_freq(unique, topic_freqs[topic], 3)
        top_shared = top_keywords_by_freq(shared, topic_freqs[topic], 2)
        shown = top_unique + top_shared

        # Add big topic label in the middle
        fig.add_annotation(
            x=x, y=y, xref="paper", yref="paper",
            text=f"<b>{topic}</b>",
            showarrow=False,
            font=dict(size=26 if topic == center_topic else 22, color="rgba(0,0,0,0.75)")
        )

        # Place a few keywords inside the circle
        if shown:
            start_y = y + r * 0.55
            step = (r * 1.10) / max(len(shown), 1)

            for j, kw in enumerate(shown):
                ky = start_y - j * step

                fig.add_trace(
                    go.Scatter(
                        x=[x], y=[ky],
                        mode="text",
                        text=[kw],
                        textfont=dict(size=13, color="rgba(0,0,0,0.60)"),
                        hovertemplate=(
                            f"<b>{topic}</b><br>"
                            f"<b>Keyword</b>: {kw}<br><br>"
                            f"<b>Unique Keywords ({len(unique)})</b><br>{format_keywords(unique)}<br><br>"
                            f"<b>Shared Keywords ({len(shared)})</b><br>{format_keywords(shared)}"
                            "<extra></extra>"
                        ),
                        showlegend=False
                    )
                )


    # Add overlap labels between center circle and each other circle
    center_x, center_y = None, None
    for topic, x, y, r, i in circle_meta:
        if topic == center_topic:
            center_x, center_y = x, y

    for topic, x, y, r, i in circle_meta:
        if topic == center_topic:
            continue

        overlap = topic_sets[topic] & topic_sets[center_topic]
        if len(overlap) == 0:
            continue

        # Place overlap text in-between circles
        mx = (x + center_x) / 2
        my = (y + center_y) / 2

        overlap_list = sorted(list(overlap))
        overlap_preview = "<br>".join(overlap_list[:2]) if len(overlap_list) > 0 else ""

        fig.add_trace(
            go.Scatter(
                x=[mx], y=[my],
                mode="text",
                text=[overlap_preview],
                textfont=dict(size=13, color="rgba(0,0,0,0.55)"),
                hovertemplate=(
                    f"<b>Overlap</b>: {center_topic} ∩ {topic}<br>"
                    f"Shared keywords: {len(overlap)}<br><br>"
                    f"<b>ALL Shared Keywords</b><br>{format_keywords(overlap)}"
                    "<extra></extra>"
                ),
                showlegend=False
            )
        )

    fig.update_layout(
        margin=dict(l=10, r=10, t=70, b=10),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
        paper_bgcolor="white",
        plot_bgcolor="white"
    )

    # Save Venn Diagram to Visualizations folder as HTML
    vis_folder = os.path.join(output_folder, "Visualizations")
    os.makedirs(vis_folder, exist_ok=True)
    output_file = os.path.join(vis_folder, f"venn_diagram_{os.path.basename(file_path).replace('.csv', '')}.html")
    fig.write_html(output_file)  # Save interactive chart as HTML
    print(f"🟣 Venn diagram saved to '{output_file}'")
    return output_file  # Return path to saved file
