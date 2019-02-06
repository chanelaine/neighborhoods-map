import React, { Component } from 'react';

class Search extends Component {

  render () {
    return (
      <div className="search">
        <div className="search-bar">
          <input type="text"
                 placeholder="Search for a restaurant"
                 value={this.props.query}
                 aria-label="Search"
                 className="search-bar-input"
                 onChange={event => this.props.searchQuery(event.target.value)}/>
        </div>

        <div className="search-results">
          <ul className="venues-list">
             {this.props.results &&
              this.props.results.length > 0 &&
              this.props.results.map((venue, index) => (
                <li className="venue-list-item" key={index}>
                  <button className="venue-list-item-button"
                          key={index}
                          onClick={() => {
                            this.props.clickedOnSpot(venue)
                          }}>{venue.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}


export default Search
