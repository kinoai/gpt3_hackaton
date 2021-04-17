import pickle

with open("data/papers_full.pickle", "rb") as handle:
    data = pickle.load(handle)
    # print(b)

for key, value in data[0].items():
    print(value)
    print()
