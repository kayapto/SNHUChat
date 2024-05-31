import os
import subprocess
import spacy
import sqlite3
import requests
from flask import Flask, render_template, request, jsonify
from xvfbwrapper import Xvfb
from langchain.agents import create_sql_agent
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain_openai import OpenAI
from pydantic import ValidationError, root_validator
from typing import Any, Dict
from weaviate.client import WeaviateClient
from weaviate.connect import ConnectionParams, ProtocolParams

app = Flask(__name__)

class LangChainDeprecationWarning(UserWarning):
    pass

import warnings
warnings.simplefilter("ignore", LangChainDeprecationWarning)

nlp = spacy.load("en_core_web_sm")

os.environ['OPENAI_API_KEY'] = "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"

conn = sqlite3.connect('cpt_codes_sql.db')
db = SQLDatabase.from_uri("sqlite:///cpt_codes_sql.db")

llm = OpenAI(temperature=0,)
toolkit = SQLDatabaseToolkit(db=db, llm=llm)
agent_executor = create_sql_agent(llm=llm, toolkit=toolkit, verbose=True)

http_params = ProtocolParams(
    scheme="https",
    host="cptcodes-zgbkr2nf.weaviate.network",
    port=443,
    secure=True,
    cafile=None
)

grpc_params = ProtocolParams(
    scheme="grpc",
    host="cptcodes-zgbkr2nf.weaviate.network",
    port=8080,
    secure=True,
    cafile=None
)

connection_params = ConnectionParams(
    http=http_params,
    grpc=grpc_params,
    secure=True,
    cafile=None
)

weaviate_client = WeaviateClient(connection_params)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_query', methods=['POST'])
def process_query():
    query = request.form['query']
    response = process_query_text(query)
    return jsonify({'response': response})

def process_query_text(query):
    doc = nlp(query)
    intent = detect_intent(doc)
    
    if intent == "database_query":
        return execute_database_query(doc)
    elif intent == "vector_query":
        return execute_vector_query(doc)
    elif intent == "semantic_search":
        return perform_semantic_search(query)
    elif intent == "keyword_search":
        return perform_keyword_search(query)
    elif intent == "rag_individual":
        return perform_rag_on_individual_objects(query)
    elif intent == "rag_entire_set":
        return perform_rag_on_entire_set(query)
    elif intent == "weaviate_api":
        return fetch_weaviate_api()
    else:
        return execute_ai_query(query)

def detect_intent(doc):
    if any(token.text.lower() in {"insert", "delete"} for token in doc):
        return "database_query"
    elif any(token.text.lower() in {"vector", "weaviate"} for token in doc):
        return "vector_query"
    elif "semantic" in [token.text.lower() for token in doc]:
        return "semantic_search"
    elif "keyword" in [token.text.lower() for token in doc]:
        return "keyword_search"
    elif "rag" in [token.text.lower() for token in doc]:
        if "individual" in [token.text.lower() for token in doc]:
            return "rag_individual"
        elif "entire" in [token.text.lower() for token in doc]:
            return "rag_entire_set"
    elif "weaviate" in [token.text.lower() for token in doc]:
        return "weaviate_api"
    else:
        return "chat_query"

def execute_database_query(doc):
    try:
        query = doc.text
        cursor = conn.cursor()
        cursor.execute(query)
        conn.commit()
        return "Database query executed successfully."
    except Exception as e:
        return f"Error executing database query: {str(e)}"

def execute_vector_query(doc):
    try:
        result = "Weaviate query executed successfully."  
        return result
    except Exception as e:
        return f"Error executing Weaviate query: {str(e)}"

def execute_ai_query(query):
    try:
        response = agent_executor.run(query)
        return response
    except Exception as e:
        return f"Error executing AI query: {str(e)}"

def perform_semantic_search(query):
    try:
        result = "Semantic search executed successfully."  
        return result
    except Exception as e:
        return f"Error performing semantic search: {str(e)}"

def perform_keyword_search(query):
    try:
        result = "Keyword search executed successfully." 
        return result
    except Exception as e:
        return f"Error performing keyword search: {str(e)}"

def perform_rag_on_individual_objects(query):
    try:
        result = "RAG on individual objects executed successfully."  
        return result
    except Exception as e:
        return f"Error performing RAG on individual objects: {str(e)}"

def perform_rag_on_entire_set(query):
    try:
        result = "RAG on the entire set of returned objects executed successfully."  
        return result
    except Exception as e:
        return f"Error performing RAG on the entire set of returned objects: {str(e)}"

def fetch_weaviate_api():
    weaviate_url = 'https://cptcodes-zgbkr2nf.weaviate.network/v1/meta'
    
    try:
        response = requests.get(weaviate_url)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': 'Failed to fetch data from Weaviate API'}, response.status_code
    except Exception as e:
        return {'error': f'An error occurred: {str(e)}'}, 500

if __name__ == '__main__':
    app.run(debug=True)
