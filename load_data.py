import pickle


def load_data():
    with open("data/papers_full.pickle", "rb") as handle:
        data = pickle.load(handle)
    return data


def load_prompt(filename="prompt.txt"):
    with open(filename, "r") as handle:
        data = handle.read()
    return data


if __name__ == "__main__":
    data = load_data()
    for key, value in data[0].items():
        print(key)
        print()
