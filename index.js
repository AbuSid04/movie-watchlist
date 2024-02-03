const movieSearchEl = document.getElementById("search-movie")
const moviesListEl = document.getElementById("movies-list")
const watchlistEl = document.getElementById("watchlist")
const moviesFromLoSt = JSON.parse( localStorage.getItem("watchlistMovies") )


let moviesIdArr = []
let moviesArr = []
let watchlistArr = []


if(moviesFromLoSt){
    watchlistArr = moviesFromLoSt
    renderWatchlist()
}

document.addEventListener("click", function(e){
    
    if(e.target.id === "search-btn"){
        getMovies()
    }

    if(e.target.dataset.add){
       handleAddClick(e.target.dataset.add)
    }
    
    if(e.target.dataset.remove){
       handleRemoveClick(e.target.dataset.remove)
       if(watchlistArr.length === 0){
            localStorage.clear()
            window.location.href = "watchlist.html"
        }
    }
})

function getTempleteHtml(dataArr , isWatchlist){
    let templateHtml = ""
    dataArr.forEach(movie => {
        const addBtnHtml = `<img class="movie-add-icon" data-add=${movie.imdbID} src="/img/add-icon.png" alt="">
        <p class="movie-add-text">Watchlist</p>
        `
        const removeBtnHtml = `<img class="movie-remove-icon" data-remove=${movie.imdbID} src="/img/remove-icon.png" alt="">
        <p class="movie-remove-text">Remove</p>
        `
        const btnHtml = isWatchlist ? removeBtnHtml : addBtnHtml

        templateHtml += `
            <div class="movie-block">
                <img class="movie-poster" src=${movie.Poster} alt="">
                <div class="movie-info-block">
                    <div class="movie-title-block">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <img class="movie-rating-icon" src="/img/rating-icon.png" alt="">
                        <p class="movie-rating">${movie.imdbRating}</p>
                    </div>    
                    <div class="movie-add-block">
                        <p class="movie-duration">${movie.Runtime}</p>
                        <p class="movie-genre">${movie.Genre}</p>
                        ${btnHtml}
                    </div>
                    <div class="movie-plot-block">
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
            </div>
            <hr />
        `
    })

    return templateHtml
}

async function getMovies(){
    const searchRes = await fetch(`https://www.omdbapi.com/?apikey=cad9a741&s=${movieSearchEl.value}`)
    const searchData = await searchRes.json()
    if(searchData.Search){
        moviesIdArr = searchData.Search.map(movie => movie.imdbID)
        moviesArr = await Promise.all (moviesIdArr.map(async (movieId) => {
            const MovieRes = await fetch(`https://www.omdbapi.com/?apikey=cad9a741&i=${movieId}`)
            return movieData = await MovieRes.json()
        }))

        renderMovies()
    }
    else{
        moviesListEl.innerHTML = `<p class="empty-search">Unable to find what you're looking for. Please try another search.</p>`
    }

}


function handleAddClick(movieID){
    const movieObj = moviesArr.filter(movie => {
        return movie.imdbID === movieID
    })[0]

    let isDuplicate = false
    watchlistArr.forEach( thisMovie=>{
        if(thisMovie.imdbID === movieObj.imdbID){
            isDuplicate = true
        }
    })

    if(movieObj && !isDuplicate){
        watchlistArr.unshift(movieObj)
        localStorage.setItem("watchlistMovies", JSON.stringify(watchlistArr))
    }    
}

function handleRemoveClick(movieId){
    watchlistArr = watchlistArr.filter(movie => movie.imdbID !== movieId)
    localStorage.setItem("watchlistMovies", JSON.stringify(watchlistArr))
    renderWatchlist()
}

function renderMovies(){
    try {
        moviesListEl.innerHTML = getTempleteHtml(moviesArr, false)
    } catch (error) {
    }
}

function renderWatchlist(){
    try {
        watchlistEl.innerHTML = getTempleteHtml(watchlistArr, true)
    } catch (error) {
    }
}

                 