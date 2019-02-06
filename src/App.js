import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Search from './Search.js'
import Errorboundary from './Errorboundary'

class App extends Component {
  constructor(props) {
    super(props);
  this.state = {
    venues: [],
    allMarkers: [],
    results: [],
    query: ""
  }
  }
  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyACw6zB0yPK5NGcPZMgtlvcXpLxeNz2cKo&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "EYJCAAINPD5VSJ4PT0GBCTLUXQR52IUIXV3NGLCYCF0HB2QV",
      client_secret: "O5TYKE5UWLUQSRNADV34VFFYJXOQX0L1Q0MPYTLN2XESWG5I",
      query: "food",
      near: "Flushing",
      v: "20190205"
    }

    // set venues
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        alert(error)
      })
  }

  initMap = () => {
    // create map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7623706, lng: -73.8371959},
      zoom: 14
    })
    let mapMarkers = [];
    // creates InfoWindow
    var infowindow = new window.google.maps.InfoWindow();

    //create and display markers
    this.state.venues.map(myVenue => {

      var contentString = `<h3>${myVenue.venue.name}</h3><p>${myVenue.venue.location.address}</p><p></p>`

      // create marker
      var marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        id: myVenue.venue.id,
        name: myVenue.venue.name,
        animation: window.google.maps.Animation.DROP
      });

      marker.addListener('click', function() {
        // change InfoWindow content
        infowindow.setContent(contentString)
        // open InfoWindow
        infowindow.open(map, marker);
        // animate marker when clicked
        marker.setAnimation(4)
      });
      mapMarkers.push(marker);
      return myVenue
    })
    this.setState({ results: mapMarkers, allMarkers: mapMarkers })
  }


  searchQuery = (query) => {
    this.setState({ query: query.trim() }, () => {
      this.searchUpdate(this.state.query)
    })
  }

  searchQuery = (query) => {
    let searchedVenues = this.state.allMarkers.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    this.state.allMarkers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase())
        ? marker.setVisible(true)
        : marker.setVisible(false)
    })
    this.setState({ results: searchedVenues, query })
  }

  clickedOnSpot = venue => {
    const marker = this.state.allMarkers.find(m => m.id === venue.id);
    window.google.maps.event.trigger(marker, 'click');
  }

  render() {
    return (
      <main>
        <Errorboundary>
          <div id="map" role="application" aria-label="map">Map Loading...</div>
        </Errorboundary>
        <Errorboundary>
          <Search allMarkers={this.state.allMarkers}
            clickedOnSpot={this.clickedOnSpot}
            searchQuery={this.searchQuery}
            results={this.state.results}
            />
        </Errorboundary>
      </main>
    );
  }
}


function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
