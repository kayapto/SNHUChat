import weaviate

# Set your Weaviate API key
weaviate_api_key = "4xY6X9Pjatk6gWUxkNg88Hnul1UKcqRjezkH"

# Initialize the Weaviate client
client = weaviate.Client(
    url="https://cptcodes-zgbkr2nf.weaviate.network",
    auth_client_secret=weaviate_api_key
)
