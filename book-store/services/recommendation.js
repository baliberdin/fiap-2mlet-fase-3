const http = require('http')
const books = require('./books');

module.exports = {
  getBookRecommendations: async function(isbn){
    return new Promise((resolve, reject) => {
      http.get(`http://${process.env.RECOMMENDATION_API_HOST}:${process.env.RECOMMENDATION_API_PORT}/books/recommendation?isbn=${isbn}&n=5`, (resp) => {
        const { statusCode } = resp;
        if(statusCode !== 200){
          reject(new Error("Error on recommendation API"));
        }else{
          let data = '';
          resp.on('data', (chunk) => data += chunk);
          resp.on('end', async () => {
            try{
              let recommendations = JSON.parse(data).recommendations;
              let recommendationBooks = await books.selectByISBNList(recommendations);
              resolve(recommendationBooks);
            }catch(e){
              reject(e);
            }
          });

          resp.on('error', (e) => {
            console.log(e);
            reject(e)
          });
        }
      });
    });
  }
}