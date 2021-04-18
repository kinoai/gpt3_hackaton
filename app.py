import streamlit as st

import SessionState
from openapi import create_graph_from_list, documents, semantic_groups

from template.KnowledgeGraph import knowledge_graph

session_state = SessionState.get(
    tresholds={
        "Image segmentation and object detection": 100,
        "Natural Language Processing": 250,
        "Unsupervised, Generative Models": 105,
        "Deepfakes": 200,
        "Speech": 205,
        "Robotics": 275,
    },
)


def main():
    st.sidebar.title("Settings")

    choice = st.sidebar.selectbox(
        "Select for which group you want to set the treshold",
        list(session_state.tresholds.keys()),
    )
    treshold = st.sidebar.slider(
        f"Treshold for {choice}",
        100,
        300,
        value=session_state.tresholds[choice],
        step=5,
    )
    session_state.tresholds[choice] = treshold

    nodes, links = create_graph_from_list(
        documents=documents,
        responses=semantic_groups,
        tresholds=session_state.tresholds,
    )
    st.write("Number of links:", len(links))

    temperature = st.sidebar.slider("Temperature", 0.0, 1.0, step=0.01)
    freq_penalty = st.sidebar.slider("Frequency penalty", 0.0, 1.0, step=0.01)
    presence_penalty = st.sidebar.slider(
        "Presence penalty", 0.0, 1.0, step=0.01
    )
    engine = st.sidebar.selectbox(
        "Engine", ["ada", "babbage", "curie", "davinci"]
    )

    """
    # Digital garden

    """

    # use @st.cache to cache function state
    for key, val in session_state.tresholds.items():
        st.write("Treshold for ", key, " = ", val)

    num_clicks = knowledge_graph(nodes, links, key="knowledge-graph")


main()
