export const compare_prompt = (
  title1: string,
  abstract1: string,
  title2: string,
  abstract2: string
) => `The following is the abstract of the paper called "${title1}":

"""
${abstract1}
"""

The following is the abstract of a different paper called "${title2}":

"""
${abstract2}
"""

My friend asked me to sum up the most important points from both of those abstracts:`
