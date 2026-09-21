from fastapi import FastAPI

app = FastAPI(title="Support CRM API")


@app.get("/")
def root():
    return {"message": "Support CRM API is running"}