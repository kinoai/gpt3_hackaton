# %%
import os

import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# %%
response = openai.Completion.create(
    engine="davinci", prompt="This is a test", max_tokens=5
)

# %%
print(response)
# %%
