import React, { Component } from 'react';
import _ from 'lodash';
import { fetchStations } from './api';
const google = window.google;

/* Converts angle from degrees to radians */
function rad (angle) {
  return angle * (Math.PI / 180);
}

class GoogleMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ""
    }
  }

  componentDidMount() {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    navigator.geolocation.getCurrentPosition(
      (position) => {
          /* Find current location and initialize map */
          const { latitude, longitude } = position.coords;
          const opts = {
            zoom: 15,
            center: { lat: latitude, lng: longitude }
          };
          var map = new google.maps.Map(this.refs.map, opts);


          /* Fetch and render all stations, and find nearest station */
          var closestStation = 99999999;
          var closestStationAddress = `${latitude + 0.01}, ${longitude + 0.01}`;
          fetchStations().then((data) => {
            _.map(data, (station) => {
              /* harversine formula for finding closest station */
              var dLat  = rad(latitude - station.location[1]);
              var dLong = rad(longitude - station.location[0]);
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(rad(latitude)) * Math.cos(rad(latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              var d = 6371 * c;
              if (d < closestStation) {
                closestStation = d;
                closestStationAddress = station.address
              }

              /* Create marker for station */
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(station.location[1], station.location[0]),
                map: this.state.map
              });
            });

            /* Find and render directions to nearest station */
            directionsDisplay.setMap(map);
            var start = `${latitude}, ${longitude}`;
            var end = closestStationAddress;
            var request = {
              origin: start,
              destination: end,
              travelMode: 'DRIVING'
            };
            directionsService.route(request, function(result, status) {
              if (status == 'OK') {
                directionsDisplay.setDirections(result);
              }
            });
          });


          /* save map in state */
          this.setState({ ...this.state, map, error: "" })
      },
      (err) => {
          this.setState({
            ...this.state,
            error: "Please reload and enable location services."
          })
      });
  }

  render() {
    if (google.maps) return (
      <div className="map" ref="map">
        RENDERING MAPS...
        <div style={{ color: "red", margin: "30px" }}>
          { this.state.error }
        </div>
      </div>
    )

    return <div>Loading Google Maps...</div>
  }
}

export default GoogleMap;
