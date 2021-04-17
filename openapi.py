import os

import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
engine = 'ada'


def get_keywords(text: str):
    response = openai.Completion.create(
      engine=engine,
      prompt=f'{text} \n Keywords:',
      temperature=0.3,
      max_tokens=60,
      top_p=1.0,
      frequency_penalty=0.8,
      presence_penalty=0.0,
      stop=["\n"]
    )

    return response
