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
engine = "babbage"


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


def common_things(text1, text2):
    response = openai.Answer.create(
        search_model=engine,
        model=engine,
        question=f"What common topics does this text \"{text1}\" have comparing to this text \"{text2}\"?",
        examples_context="Scientists try to optimize algorithms to get better results.",
        examples=[
            ["What common topics does this text \"Convolutional networks are at the core of most stateof-the-art computer vision solutions for a wide variety of tasks\" have comparing to this text \"Here we are exploring ways to scale up networks in ways that aim at utilizing the added computation as efficiently as possible by suitably factorized convolutions and aggressive regularization\"?", "Both utilize convolutional neural networks."],
            ["What common topics does this text \"In this work we investigate the effect of the convolutional network depth on its accuracy in the large-scale image recognition setting\" have comparing to this text \"We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes\"?", 'They cover the topic of image classification'],
            # ["What common topics does this text \"We propose two novel model architectures for computing continuous vector representations of words from very large data sets. The quality of these representations is measured in a word similarity task, and the results are compared to the previously best performing techniques based on different types of neural networks. We observe large improvements in accuracy at much lower computational cost, i.e. it takes less than a day to learn high quality word vectors from a 1.6 billion words data set. Furthermore, we show that these vectors provide state-of-the-art performance on our test set for measuring syntactic and semantic word similarities\" have comparing to this text \"We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes\"?", 'They don\'t have much in common'],
            ],
        documents=["Gaussian mixture models are currently the dominant technique for modeling the emission distribution of hidden Markov models for speech recognition. We show that better phone recognition on the TIMIT dataset can be achieved by replacing Gaussian mixture models by deep neural networks that contain many layers of features and a very large number of parameters. These networks are first pre-trained as a multilayer generative model of a window of spectral feature vectors without making use of any discriminative information. Once the generative pre-training has designed the features, we perform discriminative fine-tuning using backpropagation to adjust the features slightly to make them better at predicting a probability distribution over the states of monophone hidden Markov models"],
        max_tokens=100,
        stop=['\n'],
    )

    return response


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
