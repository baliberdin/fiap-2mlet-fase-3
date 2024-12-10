window.onload = function(){
    let ratingRange = document.getElementById("rating-range");
    let ratingLabel = document.getElementById("rating-label");

    ratingRange.onchange = function(e){
        switch (ratingRange.value * 1) {
            case 0:
                ratingLabel.innerHTML = "Quero minhas horas de vida de volta!";
                break;
            case 1:
                ratingLabel.innerHTML = "Precisa melhorar muito pra ficar ruim!";
                break;
            case 2:
                ratingLabel.innerHTML = "Nem perde seu tempo!";
                break;
            case 3:
                ratingLabel.innerHTML = "Teria sido melhor ir ver o filme do Pelé";
                break;
            case 4:
                ratingLabel.innerHTML = "Precisa insistir, mas não melhora muito";
                break;
            case 5:
                ratingLabel.innerHTML = "Não é péssimo, mas também não é ótimo!";
                break;
            case 6:
                ratingLabel.innerHTML = "Dá para perder um tempo!";
                break;
            case 7:
                ratingLabel.innerHTML = "Gostosinho!";
                break;
            case 8:
                ratingLabel.innerHTML = "Melhor que lasanha!";
                break;
            case 9:
                ratingLabel.innerHTML = "Uma obra prima!";
                break;
            case 10:
                ratingLabel.innerHTML = "Me senti incompleto quando acabei!";
                break;
            default:
                break;
        }
        console.log(ratingRange.value);
    }
};