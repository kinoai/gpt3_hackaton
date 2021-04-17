# %%
import json
import os
import pickle
from collections import defaultdict
from itertools import combinations
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

    # "document": 0,
    # "object": "search_result",
    # "score": 155.354


def update_nodes(
    documents: list, query: str, treshold: int, nodes: list = None
) -> list:
    if nodes == None:
        nodes = [{"doc": doc["title"], "groups": []} for doc in documents]

    # response = semantic_search(documents=documents, query=query)
    with open("data/semantic_search_response.json") as fp:
        response = json.load(fp)

    for item in response["data"]:
        if item["score"] >= treshold:
            nodes[item["document"]]["groups"].append(
                {"name": query, "score": item["score"]}
            )

    return nodes


def get_links(nodes: list) -> list:
    groups = defaultdict(list)
    for node in nodes:
        for group in node["groups"]:
            groups[group["name"]].append(node["doc"])
    links = []
    for key, val in groups.items():
        pairs = list(combinations(val, 2))
        links.extend(
            [
                {"target": pair[0], "source": pair[1], "group": key}
                for pair in pairs
            ]
        )

    return links


with open("data/papers.pickle", "rb") as handle:
    data = pickle.load(handle)

nodes = update_nodes(
    documents=data, query="Parameter optimization", treshold=250
)
nodes = update_nodes(
    documents=data[::-1], query="Another one", treshold=210, nodes=nodes
)

# print(nodes)
# print(get_links(nodes=nodes))
