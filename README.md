# GPT-3-based application

The application was developed for the NextGrid Deep Learning Labs #2 hackathon by the following Sekcja Sztucznej Inteligencji members: Adrian Zjawiński, Łukasz Zalewski, Kacper Włodarczyk, Adrian Zieliński (team name -- Oompa Loompas). 
The team placed first out of 16 contestant teams. The event took place in cooperation with OpenAI, ultimately enabling the teams to access ChatGPT-3 before the official release. 

Below is a brief description of the solution: 

*We present a method for extracting insights from digital gardens (databases of notes, publications, etc.) through GPT semantic search.
Our app can convert a set of documents to an interactive knowledge graph, and allows the user to ask ChatGPT-3 for short summaries or comparisons between different documents (nodes of the graph).
We show how it works on a set of most cited deep learning papers.
Our solution could potentially be generalized to different knowledge bases (e.g. private notes, blog posts, documentations, etc.) and there are lots of potential ways of how the graphs/visualisations could be extended.*

## Reports
The official Notion page of the event: https://www.notion.so/Deep-Learning-Labs-2021-21db9dbb97514d60b52e2a9bda992d18 (Deep Learning Labs 2021 EP#2)
A video-presentation of the application: https://youtu.be/FpBiSDYKk2Q

## Run app
```
git clone git@github.com:kinoai/gpt3_hackaton.git
pip install -r requirements.txt
streamlit run app.py
```

## App demo
![](https://github.com/kinoai/gpt3_hackaton/blob/resources/demo.gif)


<!-- ```
apt-get install libpoppler-cpp-dev
``` -->
