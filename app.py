import streamlit as st

import SessionState
from openapi import create_graph_from_list, documents, semantic_groups

session_state = SessionState.get(
    tresholds={
        "Image segmentation and object detection": 50,
        "Natural Language Processing": 50,
        "Unsupervised, Generative Models": 50,
        "Deepfakes": 50,
        "Speech": 50,
        "Robotics": 50,
    },
)


def main():
    st.sidebar.title("Settings")

    choice = st.sidebar.selectbox(
        "Select for which group you want to set the treshold",
        list(session_state.tresholds.keys()),
    )
    treshold = st.sidebar.slider(
        f"Treshold for {choice}", 0, 300, value=session_state.tresholds[choice]
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

    ### _Queries_: \n
    _How is the first paper similar to the second paper?_\n
    _How is the first paper different from the second paper?_\n
    _What is the main of the first paper?_\n
    _What is the main topic of the second paper?_\n
    _Why does the first paper belong to class X?_\n
    _Why does the second paper belong to class X?_\n

    """

    text = st.text_input("Enter some text here.")

    f"{text}" if text else ""

    # use @st.cache to cache function state
    for key, val in session_state.tresholds.items():
        st.write("Treshold for ", key, " = ", val)


main()
