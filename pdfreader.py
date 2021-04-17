import pdftotext

# Load your PDF
with open("1503.02531.pdf", "rb") as f:
    pdf = pdftotext.PDF(f)

# If it's password-protected
# with open("secure.pdf", "rb") as f:
#     pdf = pdftotext.PDF(f, "secret")

# How many pages?
print(len(pdf))

# Iterate over all the pages
# for page in pdf:
#     print(page)

# Read some individual pages
# print(pdf[0])
# print(pdf[1])

print(type(pdf))
print(type(pdf[0]))
print(dir(pdf))
print(pdf[0])

# Read all the text into one string
# print("\n\n".join(pdf))