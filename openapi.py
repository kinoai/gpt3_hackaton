# %%
import json
import os
import pickle
from typing import Generator
from warnings import resetwarnings

import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
engine = "ada"


def get_keywords(text: str):
    response = openai.Completion.create(
        engine=engine,
        prompt=f"{text} \n Keywords:",
        temperature=0.1,
        max_tokens=60,
        top_p=1.0,
        frequency_penalty=0.8,
        presence_penalty=0.0,
        stop=["\n"],
    )

    return response


def get_keypoints(text: str):
    response = openai.Completion.create(
        engine=engine,
        prompt=f"What are the key points from this text? \n {text}:",
        temperature=0.5,
        max_tokens=100,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\n"],
    )

    return response


def semantic_search(documents: list, query: str):
    docs = [
        " ".join(
            [
                doc["title"].replace("\n", " "),
                doc["abstract"].replace("\n", " "),
            ]
        )
        for doc in documents
    ]
    response = openai.Engine(engine).search(documents=docs, query=query)

    return response


def create_graph(documents: list, query: str, treshold: int):
    # response = semantic_search(documents=documents, query=query)
    with open("data/semantic_search_response.json") as fp:
        response = json.load(fp)

    graph = {"name": query, "children": []}

    for item in response["data"]:
        if item["score"] >= treshold:
            graph["children"].append(documents[item["document"]])

    return graph


with open("data/papers.pickle", "rb") as handle:
    data = pickle.load(handle)

graph = create_graph(data, "Parameter optimization", 250)
