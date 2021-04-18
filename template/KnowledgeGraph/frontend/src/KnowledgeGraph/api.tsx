import axios from "axios"

import { compare_prompt } from "./prompts"

const ENGINE = "davinci"

const instance = axios.create({
  baseURL: `https://api.openai.com/v1/engines/${ENGINE}/`,
  headers: { Authorization: "Bearer " + process.env.REACT_APP_OPENAI_API_KEY },
  timeout: 20000,
})

// @ts-ignore
export const compare_papers = async (title1, abstract1, title2, abstract2) =>
  await instance
    .post("completions", {
      prompt: compare_prompt(title1, abstract1, title2, abstract2),
      temperature: 0.3,
      max_tokens: 400,
      top_p: 1.0,
      frequency_penalty: 1.0,
      presence_penalty: 0.0,
    })
    .then((resp) => {
      console.log(`resp`, resp)
      console.log(`resp.json().choices[0].text`, resp.data.choices[0].text)
      return resp.data.choices[0].text
    })

// prompt = load_prompt(filename="prompts/compare.txt")
//     prompt = prompt.format(
//         title1=title1, abstract1=abstract1, title2=title2, abstract2=abstract2
//     )

//     # print(prompt)

//     response = openai.Completion.create(
//         engine=engine,
//         prompt=prompt,
//         temperature=0.3,
//         max_tokens=400,
//         top_p=1.0,
//         frequency_penalty=1.0,
//         presence_penalty=0.0,
//     )

//     return response
