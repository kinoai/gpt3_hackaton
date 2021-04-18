import streamlit as st

import SessionState
from openapi import create_graph_from_list, documents, semantic_groups

session_state = SessionState.get(
    thresholds={
        "Image segmentation and object detection": 100,
        "Natural Language Processing": 250,
        "Unsupervised, Generative Models": 105,
        "Deepfakes": 200,
        "Speech": 205,
        "Robotics": 275,
    },
    pages=("Graphs", "Thresholds"),
)


@st.cache
def get_graph(thresholds):
    return create_graph_from_list(
        documents=documents,
        responses=semantic_groups,
        thresholds=thresholds,
    )


def settings():
    st.sidebar.title("Settings")

    page = st.sidebar.radio("Select page", session_state.pages)

    temperature = st.sidebar.slider("Temperature", 0.0, 1.0, step=0.01)
    freq_penalty = st.sidebar.slider("Frequency penalty", 0.0, 1.0, step=0.01)
    presence_penalty = st.sidebar.slider(
        "Presence penalty", 0.0, 1.0, step=0.01
    )
    engine = st.sidebar.selectbox(
        "Engine", ["ada", "babbage", "curie", "davinci"]
    )

    return page


def threshold_page():
    st.title("Set thresholds")
    for key, val in session_state.thresholds.items():
        # st.write("Threshold for ", key, " = ", val)
        threshold = st.slider(f"Threshold for {key}", 100, 300, val)
        session_state.thresholds[key] = threshold


def graph_page():
    st.title("Awesome graphs!")


def main():

    page = settings()

    if page == "Thresholds":
        threshold_page()
    else:
        graph_page()

    nodes, links = get_graph(session_state.thresholds)


main()
