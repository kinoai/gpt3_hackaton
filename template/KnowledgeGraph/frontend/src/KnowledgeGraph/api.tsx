import axios from "axios"

import { compare_prompt, tldr_prompt } from "./prompts"

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
      temperature: 0.25,
      max_tokens: 300,
      top_p: 1.0,
      frequency_penalty: 1.0,
      presence_penalty: 0.0,
    })
    .then((resp) => {
      return resp.data.choices[0].text
    })

export const get_tldr = async (abstract: string) =>
await instance
  .post("completions", {
    prompt: tldr_prompt(abstract),
    temperature: 0.0,
    max_tokens: 82,
    top_p: 1.0,
    frequency_penalty: 1.0,
    presence_penalty: 0.0,
    stop: "."
  })
  .then((resp) => {
    return resp.data.choices[0].text
  })
