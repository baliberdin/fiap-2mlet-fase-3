from fastapi import FastAPI
from fastapi.exceptions import HTTPException
import pickle

app = FastAPI(title="Recommendation API")
recommendation_model = {}
recommendation_matrix = {}
recommendation_encoder = {}

@app.get("/")
async def root():
    return {}

try:
    with open('./models/cosine/book_recommendation_model.pickle', 'rb') as f:
        recommendation_model = pickle.load(f)

    with open('./models/book_recommendation_matrix.pickle', 'rb') as f:
        recommendation_matrix = pickle.load(f)

    with open('./models/book_recommendation_encoder.pickle', 'rb') as f:
        recommendation_encoder = pickle.load(f)
except Exception as e:
    print(e)


@app.get("/books/recommendation")
async def book_recommendation(isbn: str, n: int):
    default_n = 10
    limit = len(recommendation_encoder.classes_)
    n_request = default_n if n*2 < 1 or n*2 > min(default_n,limit) else n*2

    try:
        item_index = recommendation_encoder.transform([isbn])
        distances, indices = recommendation_model.kneighbors(recommendation_matrix[item_index], n_neighbors=n_request)
        recommendations = list(recommendation_encoder.inverse_transform(indices.flatten()))
        print(recommendations);
        recommendations = list(filter(lambda x: x != isbn, recommendations))
        return {"recommendations": recommendations[:n]}
    except Exception as e:
        return {"recommendations": []}