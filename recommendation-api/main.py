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

# Desserializa os modelos de recomendação que foram gerados pelo Notebook
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
    """Endpoint para requisitar recomendações de livros
    Args: 
        isbn: str - Código ISBN do livro para o qual queremos algumas recomendações
        n: int - Quantidade de recomendações que queremos
    Returns: dict
    """

    # Trata a quantidade de recomendações pedindo um item a mais para os casos onde o próprio livro
    # de entrada seja retornado como recomendação e também para casos onde o número de recomendações
    # ultrapassa as quantidades limites disponíveis.
    default_n = 10
    limit = len(recommendation_encoder.classes_)
    n_request = default_n if n*2 < 1 or n*2 > min(default_n,limit) else n*2

    try:
        # Encontra o livro de entrada no Encoder
        item_index = recommendation_encoder.transform([isbn])
        # Requisita os índices dos vizinhos mais próximos ao livro
        distances, indices = recommendation_model.kneighbors(recommendation_matrix[item_index], n_neighbors=n_request)
        # Inverte os indices para os ISBNs originais
        recommendations = list(recommendation_encoder.inverse_transform(indices.flatten()))
        # Remove o ISBN que foi usado como fonte das recomendações caso ele tenha vindo.
        recommendations = list(filter(lambda x: x != isbn, recommendations))
        return {"recommendations": recommendations[:n]}
    except Exception as e:
        return {"recommendations": []}