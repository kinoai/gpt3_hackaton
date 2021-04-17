# %%
import json
import os
import pickle

import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# %%
with open("./data/papers.pickle", "rb") as handle:
    data = pickle.load(handle)
# %%
# with open("file.jsonl", "w") as outfile:
#     json.dump(text, outfile)

# %%
# openai.File.create(file=open("file.jsonl"), purpose="answers")
# %%
docs = [
    art["title"].replace("\n", " ") + " " + art["abstract"].replace("\n", " ")
    for art in data
]

response = openai.Engine("davinci").search(
    documents=docs, query="Parameter optimization"
)
# %%
print(response)
