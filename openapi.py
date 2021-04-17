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
      temperature=0.1,
      max_tokens=60,
      top_p=1.0,
      frequency_penalty=0.8,
      presence_penalty=0.0,
      stop=["\n"]
    )

    return response


def get_keypoints(text: str):
    response = openai.Completion.create(
      engine=engine,
      prompt=f'What are the key points from this text? \n {text}:',
      temperature=0.5,
      max_tokens=100,
      top_p=1.0,
      frequency_penalty=0.0,
      presence_penalty=0.0,
      stop=["\n"]
    )

    return response
