import re

import requests
from bs4 import BeautifulSoup

response = requests.get(
    "https://github.com/terryum/awesome-deep-learning-papers"
)
# Store the webpage contents
webpage = response.content
# Check Status Code (Optional)
# print(response.status_code)
# Create a BeautifulSoup object out of the webpage content
soup = BeautifulSoup(webpage, "html.parser")


# print(soup)clear

links = []
ids = []
for link in soup.findAll("a", attrs={"href": re.compile("^http://*")}):
    l = link.get("href")

    if "arxiv" in l:
        links.append(l)
        index = l.rfind("/")
        ids.append(l[index + 1 :].strip(".pdf"))


# for l in links:
#     print(l)

# print(links)
# print(ids)


import arxiv

search = arxiv.Search(id_list=ids)

iterator = search.get()
# paper = next(iterator)
# print(paper.title)
# paper = next(iterator)
# print(paper.title)

# print(dir(paper))
# print(paper.summary)
# print(paper.introduction)

data = []

for paper in iterator:
    print(paper.title)
    paper_data = {}
    paper_data["title"] = paper.title
    paper_data["abstract"] = paper.summary

    path = paper.download_pdf(dirpath="data/")

    import pdftotext

    # Load your PDF
    with open(path, "rb") as f:
        pdf = pdftotext.PDF(f)
        paper_data["full_text"] = "\n\n".join(pdf)

    data.append(paper_data)


print(len(paper_data))


import pickle

with open("data/papers_full.pickle", "wb") as handle:
    pickle.dump(data, handle, protocol=pickle.HIGHEST_PROTOCOL)


with open("data/papers_full.pickle", "rb") as handle:
    data = pickle.load(handle)
    # print(b)

for key, value in data[0].items():
    print(value)
