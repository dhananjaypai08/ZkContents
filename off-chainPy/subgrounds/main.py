from fastapi import FastAPI, HTTPException, Request
import json
import uvicorn
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from subgrounds import AsyncSubgrounds

app = FastAPI()
sg = AsyncSubgrounds()

genai.configure(api_key='AIzaSyAko8amOXOb97gqMC6OBZYOiY0Ela8XSrs')
model = genai.GenerativeModel(model_name='gemini-pro')

origins = [
    "http://localhost",
    "http://localhost:8001",
    "http://localhost:3000",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

default_endpoint = "https://api.studio.thegraph.com/query/90589/zkcdngraph/version/latest"
SubgraphData = None
pretext = "You are a system that can answer queries that are regarding a knowledge base. The knowledge base data is given and based on this knowledge base given response to the given query. You will be prompted with a query by the user based on this given data and you have to answer and only consider this given data. If you are unable to find the answer from this given data then you can use the outside data. Answer precisely and make sure to use the given data."

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the subgraph
    zkcdn = await sg.load_subgraph(default_endpoint)
    res = ""
    # Return query to a dataframe
    data = await sg.query_df([
        zkcdn.Query.mints
    ])
    res += data.to_string()
    res += " \n"
    
    data = await sg.query_df([zkcdn.Query.mappings])
    res += data.to_string()
    res += " \n"
    
    data = await sg.query_df([zkcdn.Query.convertedStrings])
    res += data.to_string()
    res += " \n"
    
    data = await sg.query_df([zkcdn.Query.encryptedCIDs])
    res += data.to_string()
    res += " \n"
    
    global SubgraphData
    SubgraphData = res 
    
    
    

@app.get("/")
async def home(api_endpoint: str):
    # Load the subgraph
    zkcdn = await sg.load_subgraph(default_endpoint)
    res = ""
    # Return query to a dataframe
    data = await sg.query_df([
        zkcdn.Query.mints
    ])
    res += data.to_string()
    res += " \n"
    
    data = await sg.query_df([zkcdn.Query.mappings])
    res += data.to_string()
    res += " \n"
    
    data = await sg.query_df([zkcdn.Query.convertedStrings])
    res += data.to_string()
    res += " \n"
    
    data = await sg.query_df([zkcdn.Query.encryptedCIDs])
    res += data.to_string()
    res += " \n"
    
    global SubgraphData
    SubgraphData = res 
    print(SubgraphData)
    return "Subgraph Loaded!"

@app.get("/query")
async def query(query: str):
    response = model.generate_content(pretext+" Given Data: "+SubgraphData+"Answer this query: "+query)
    print(response.text)
    return response.text

if __name__ == "__main__":
    uvicorn.run("main:app", port=8080, reload=True)