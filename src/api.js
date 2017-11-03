var axios = require('axios');
var _ = require('lodash');
const URL = 'https://api.voltaapi.com/v1/stations';

module.exports = {
  fetchStations: function() {
    return axios.get(URL)
      .then((response) => {
        var stationGroups = {};
        response.data.forEach((station) => {
          if (!stationGroups[station.street_address]) {
            stationGroups[station.street_address] = {
              id: station.id,
              name: station.name,
              location: station.location.coordinates,
              address: `${station.street_address}, ${station.city}, ${station.state}, ${station.zip_code}`,
              count: 1
            }
          }
          stationGroups[station.street_address].count += 1;
        })
        return stationGroups;
      });
  }
}
