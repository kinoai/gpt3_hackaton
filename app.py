import streamlit as st

st.sidebar.title("Navigation")

treshold = st.sidebar.slider("Select treshold", 0, 300)

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
