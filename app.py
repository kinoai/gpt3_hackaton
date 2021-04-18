import streamlit as st


def main():
    st.sidebar.title("Settings")

    treshold = st.sidebar.slider("Treshold", 0, 300)
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


main()
