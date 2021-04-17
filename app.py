import streamlit as st

"""
# GPT based app
"""

text = st.text_input("Enter some text here.")

f"{text}" if text else ""

# use @st.cache to cache function state
