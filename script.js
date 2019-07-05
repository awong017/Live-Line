function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

const appID = '07de26590d34af698ca9a82a14a750d4';

function displayArtistData(responseJson) {
    console.log(responseJson);

    $('.artist-data').empty();

    $('.artist-data').append(
        `<div class="artist-data-render">
            <h2 class="artist-name">${responseJson.name}</h2>
            <img class="artist-image" src="${responseJson.image_url}" alt="artist image">
        </div>`
    );
}

function displayArtistTags(responseJson) {
    console.log(responseJson);

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
    console.log(responseJson);

    $('.artist-events').empty();

    if(responseJson.length == 0) {
        $('.events-header').css('display', 'none');
    }
    else
    {
        $('.events-header').css('display','block');
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
                    <a href="${responseJson[i].offers[0].url}">Get Tickets</a>
                </div>`
            )};  
        }     
}

function displayArtistTopTracks(responseJson) {
    console.log(responseJson);

    $('.artist-top-tracks').empty();

    $('.top-tracks-header').css('display', 'block');

    for(i=0; i<10; i++) {

        $('.artist-top-tracks').append(
            `<li class="artist-top-tracks-render"><a href="${responseJson.toptracks.track[i].url}">${responseJson.toptracks.track[i].name}</a>
            </li>`        
    )}
}

function displayArtistVideos(responseJson) {
    console.log(responseJson);

    $('.artist-videos').empty();

    $('.videos-header').css('display', 'block');

    for(i=0; i<6; i++) {
        $('.artist-videos').append(
            `<div class="artist-videos-render">
                <p>${responseJson.items[i].snippet.title}</p>
                <iframe src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}?rel=0" width="300" height="300" frameborder="0"></iframe>
            </div>`
        )
    }
}

function getArtistData() {
    const artist = $('.search-bar').val();
    const url = "https://rest.bandsintown.com/artists/"+artist+"?app_id="+appID;

    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistData(responseJson));
}

function getArtistTags() {
    const artist = $('.search-bar').val();
    const apiKey="67acd0d07083aa13f9898460d96eeecf";
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist+"&api_key="+apiKey+"&format=json";

    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistTags(responseJson));
}

function getArtistTopTracks() {
    const artist = $('.search-bar').val();
    const apiKey="67acd0d07083aa13f9898460d96eeecf";
    const url="http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="+artist+"&api_key="+apiKey+"&format=json";

    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistTopTracks(responseJson));
}

function getArtistVideos() {
    const apiKey = 'AIzaSyBp9C-ptSoFe-4F2sJtBN3g46VkVP9Xe_I'; 
    const artist = $('.search-bar').val();
    const searchURL = 'https://www.googleapis.com/youtube/v3/search';

    const params = {
        key: apiKey,
        q: artist,
        part: 'snippet',
        maxResults: 50,
        type: 'video'
      };
      const queryString = formatQueryParams(params)
      const url = searchURL + '?' + queryString;
    
      console.log(url);
    
      fetch(url)
      .then(response => response.json())
      .then(responseJson => displayArtistVideos(responseJson));
    }

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getArtistEvents() {
    const artist = $('.search-bar').val();
    const url = "https://rest.bandsintown.com/artists/"+artist+"/events?app_id="+appID;

    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayArtistEvents(responseJson));
}


function handleSearch() {
    $('form').on('click', '.submit', function(event) {
        event.preventDefault();
        getArtistData();
        getArtistTags();
        getArtistTopTracks();
        getArtistVideos();
        getArtistEvents();
        $('.homepage').css('display', 'none');
        $('#js-homepage').css('text-align', 'right')
    });
}

function setupHandlers() {
    handleSearch();
}

$(setupHandlers);