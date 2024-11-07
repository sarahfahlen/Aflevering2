d3.json("albums.json").then(function (data) {
    console.log(data);

//Opretter objekter, som bruges til at hente data til tabel
let musicObjects= [];
  for (let i in data) {
    let trackTitles = [];
  for (let j in data[i].trackList){
    let timeInSeconds = data[i].trackList[j].trackTimeInSeconds;
    let minutes = Math.floor(timeInSeconds/60);
    let seconds = timeInSeconds % 60
    let formattedTime;
    if (seconds < 10){
        formattedTime = `${minutes}:0${seconds}`;}
    else {
        formattedTime = `${minutes}:${seconds}`
    }
    trackTitles.push(
     data[i].trackList[j].trackNumber + ". " 
    + data[i].trackList[j].trackTitle
    + ' - ' + formattedTime
);
  }
    let music = new MUSIC(
    data[i].albumName,
    data[i].artistName,
    data[i].productionYear,
    data[i].trackList.length,
    trackTitles
    );
    musicObjects.push(music);
}
//Bruger til at tjekke om det virker
console.log(musicObjects)

//Laver en tabel i min HTML kode
const table = d3.select("#albumTable").append("table");

//Laver et table head med en række, hvor jeg definerer overskrifterne. Funktionen sørger for at overskrifterne følger vores data array
    table.append("thead").append("tr")
        .selectAll("th")
        .data(["Album titel", "Kunstner", "Udgivelsesår", "Antal sange", "Sangliste"])
        .enter()
        .append("th")
        .text(function(column) {return column; });

//Laver en række til hvert album
    const tbody = table.append("tbody");

//Udfylder hver album række, med oplysninger fra vores JSON dokument. Først laves rækkerne, herefter udfyldes cellerne med funktionen.
    tbody.selectAll("tr")
        .data(musicObjects)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function(album) {
            return [album.title, album.artist, album.year, album.numberOfTracks, album.trackList];
        })
        .enter()
        .append("td")
        .text(function (d, i) { return (i < 4) ? d : " " ; })
        .filter(function(d, i) {
            return i === 4;})
        .append("button")
        .text("Vis sangliste")
        .on("click", function (event, d) {
            displayTrackTitles(d);
});

//Constructor function der bruges til at lave nye objekter for hvert album
function MUSIC (title, artist, year, numberOfTracks, trackList) {
    this.title = title;
    this.artist = artist;
    this.year = year;
    this.numberOfTracks = numberOfTracks;
    this.trackList = trackList;
}

//Funktion der bruges til at slette de gamle tracklister
function displayTrackTitles(trackList) {
    var trackListDiv = document.getElementById("trackList");
    trackListDiv.innerHTML = "";

//Funktion der laver en tracklist for hvert album ved at oprette et p element, og indsætte tracklisten
trackList.forEach(function(track) {
        var p = document.createElement("p");
        p.textContent = track; 
        trackListDiv.appendChild(p);
    });

//Opretter en block pop-up
    document.getElementById("trackPopup").style.display = "block";

//Skjuler pop-up når man trykker på luk knappen
    document.getElementById("closePopup").onclick = function() {
        document.getElementById("trackPopup").style.display = "none";
    };
}})
