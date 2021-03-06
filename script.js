function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

const appID = 'fc1b6c460ff7425d2c09331d6e4e742d';

// The following "display" functions render data to be 
// shown in the DOM

function displayArtistData(responseJson) {
    
    $('.artist-data').empty();

    $('.artist-data').append(
        `<div class="artist-data-render">
            <h2 class="artist-name">${responseJson.name}</h2>
            <img class="artist-image" src="${responseJson.image_url}" alt="artist image">
        </div>`
    );
}

function displayArtistBio(responseJson) {
    
    displayError(responseJson);

    let keys=Object.keys(responseJson.query.pages)[0];

    let bioExtract=responseJson.query.pages[keys].extract;

    $('.artist-bio').empty();

    $('.artist-bio').append(
        `<div class="artist-bio-render">
           <p>${bioExtract}</p>
        </div>`
    )
}

function displayError(responseJson) {

    let keys=Object.keys(responseJson.query.pages)[0];

    let bioExtract=responseJson.query.pages[keys].extract;

    $('.error-page').empty();

    if(bioExtract === undefined) {
        $('.artist-data').css('display','none');
        $('.artist-bio').css('display','none');
        $('.tags').css('display','none');
        $('.top-tracks').css('display','none');
        $('.events').css('display','none');

        $('.error-page').append(
            `<div class="error-page-render">
                <p>Artist not found. Please search another artist</p>
             </div>`
        );
    }
    else
    {
        $('.artist-data').css('display','block');
        $('.artist-bio').css('display','block');
        $('.tags').css('display','block');
        $('.top-tracks').css('display','block');
        $('.events').css('display','block');
    }
}

function displayArtistTags(responseJson) {
    
    $('.artist-tags').empty();

    $('.tags-header').css('display','block');
    
    for(i=0; i<responseJson.artist.tags.tag.length; i++) {
    
        $('.artist-tags').append(
            `<div class="artist-tags-render">
                <p>${responseJson.artist.tags.tag[i].name}</p>
            </div>`
    )}

}

function displayArtistEvents(responseJson) {
    
    $('.artist-events').empty();

    if(responseJson.length == 0) {
        $('.events-header').css('display', 'none');
        $('.events-message').css('display', 'block');
    }
    else
    {
        $('.events-header').css('display','block');
        $('.events-message').css('display', 'none');
        for(let i=0; i<10; i++) {
            let area="";
            if(responseJson[i].venue.country == "United States")
                {
                    area=responseJson[i].venue.region;
                }
                else
                {
                    area=responseJson[i].venue.country;
                }

            let date=responseJson[i].datetime
            let shortDate=date.substr(0,10);

            $('.artist-events').append(
                `<div class="artist-events-render">
                    <h2 class="event-name">${responseJson[i].venue.name}</h2>
                    <p class="event-details">${responseJson[i].venue.city}, ${area}</p>
                    <p class="event-details">${shortDate}</p>
                    <a class="event-tickets" href="${responseJson[i].offers[0].url}">Get Tickets</a>
                </div>`
            )};  
        }     
}

function displayArtistTopTracks(responseJson) {
    
    $('.artist-top-tracks').empty();

    $('.top-tracks-header').css('display', 'block');

    for(i=0; i<10; i++) {

        $('.artist-top-tracks').append(
            `<p class="artist-top-tracks-render"><a href="${responseJson.toptracks.track[i].url}">${i+1})  ${responseJson.toptracks.track[i].name}</a>
            </p>`        
    )}
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


// The following "get" functions fetch the APIs needed
// for the "display" functions

function getArtistData() {
    const artist = $('.search-bar').val();
    const url = `https://rest.bandsintown.com/artists/${artist}?app_id=${appID}`;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistData(responseJson));
}

function getArtistBio() {

    const artist = $('.search-bar').val();
    const modifiedArtist = toTitleCase(artist);
    const url = `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro=1&explaintext=1&titles=${modifiedArtist}`;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistBio(responseJson));
}

function getArtistTags() {
    const artist = $('.search-bar').val();
    const apiKey="67acd0d07083aa13f9898460d96eeecf";
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${apiKey}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistTags(responseJson));
}

function getArtistTopTracks() {
    const artist = $('.search-bar').val();
    const apiKey="67acd0d07083aa13f9898460d96eeecf";
    const url=`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=${apiKey}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistTopTracks(responseJson));
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getArtistEvents() {
    const artist = $('.search-bar').val();
    const url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${appID}`;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistEvents(responseJson));
}

// Handle for the search button

function handleSearch() {
    $('form').on('click', '.submit', function(event) {
        event.preventDefault();
        getArtistData();
        getArtistBio();
        getArtistTags();
        getArtistTopTracks();
        getArtistEvents();
        $('.homepage').css('display', 'none');
        $('#js-homepage').css('text-align', 'right')
    });
}

function setupHandlers() {
    handleSearch();
}

$(setupHandlers);