# FIAP 2MLET Fase 3
Projeto para a fase 3 do curso de Machine Learning Engineering da FIAP.

Base de dados utilizada: https://www.kaggle.com/datasets/saurabhbagchi/books-dataset/data

## Estrutura
O projeto é uma simples Loja de Livros onde os usuários podem pesquisar e avaliar os livros. Com base nas avaliações dos usuários, um modelo de ML servido por uma API produz uma lista de livros relacionados quando o usuário acessa a página de um livro qualquer. 

<img src="results/screenshoots/full-ratings-cosine/python.png" width="600px"/>

Os sistemas são separado nas seguintes partes:

- Uma Aplicação Web em ExpressJS
- Uma API de Recomendações em FastAPI
- Um banco de dados MySQL
- Notebooks para processar os dados e o Modelo.

## Subindo as aplicações
Com exceção dos notebooks, o restante das aplicações são iniciadas usando Docker. Para iniciar as aplicações utilize as automações feitas em Makefile.

Subindo todas as aplicações
```sh
make run-all
```

### Pré-Requisitos para rodar as aplicações
- Make
- Docker
### Pré-Requisitos para rodar os Notebooks
- Python (3.10.15)
- Virtualenv
- Installar as Libs do `requirements.txt`
- Visual Code
- Java JDK 17+ (Apenas para os notebooks com PySpark)


# Carregando os dados no banco MySQL
Os dados usados pela aplicação estão em um backup `mysql/db_backup.sql` e para restaurá-los, utilize o comando abaixo. O comando só funcionará quando o banco MySQL estiver pronto para uso após o comando `make run-all` mostrado no passo `Subindo as aplicações`
```sh
make restore-db
```

Abra o arquivo Makefile para ver todas as tasks que podem ser executadas, como por exemplo reiniciar apenas uma aplicação ou banco.

# Acessando as aplicações
- [WebApp - Book Store](http://localhost:3000)
- [API de Recomendação (Substitua o ISBN por um número válido)](http://localhost:8000/books/recommendation?isbn=<ISBN>&n=5) 