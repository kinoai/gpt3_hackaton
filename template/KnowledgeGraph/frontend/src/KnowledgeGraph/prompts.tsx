export const compare_prompt = (
  title1: string,
  abstract1: string,
  title2: string,
  abstract2: string
) => `The following is the abstract of a paper called "${title1}":

"""
${abstract1}
"""

The following is the abstract of a different paper called "${title2}":

"""
${abstract2}
"""

My friend asked me to sum up the most important differences between approaches explained in both of those abstracts:`


export const tldr_prompt = (
  abstract: string
) => `"""
Modeling the distribution of natural images is
a landmark problem in unsupervised learning.
This task requires an image model that is at
once expressive, tractable and scalable. We
present a deep neural network that sequentially
predicts the pixels in an image along the two
spatial dimensions. Our method models the discrete probability of the raw pixel values and encodes the complete set of dependencies in the
image. Architectural novelties include fast twodimensional recurrent layers and an effective use
of residual connections in deep recurrent networks. We achieve log-likelihood scores on natural images that are considerably better than the
previous state of the art. Our main results also
provide benchmarks on the diverse ImageNet
dataset. Samples generated from the model appear crisp, varied and globally coherent.
"""
tl;dr: A new deep neural network architecture for modelling distribution of images improves state of the art on ImageNet benchmark.

"""
${abstract}
"""
tl;dr:`
