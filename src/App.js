import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TinderCard from 'react-tinder-card';
import './App.css';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [lastDirection, setLastDirection] = useState();
  const [lastSwipedProfile, setLastSwipedProfile] = useState(null);
  const childRefs = useRef([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/profiles')
      .then(response => {
        console.log('API response:', response.data);
        setProfiles(response.data);
        // Liste pour le undo swipe
        childRefs.current = Array(response.data.length).fill(0).map((_, i) => React.createRef());
      })
      .catch(error => console.log('API Error:', error));
  }, []);

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete);
    setLastDirection(direction);
    const swipedProfile = profiles.find(profile => profile.first_name === nameToDelete);
    setLastSwipedProfile(swipedProfile);
    // Remove the swiped profile from the profiles state
    setProfiles(prevProfiles => prevProfiles.filter(profile => profile.first_name !== nameToDelete));
  };

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  };

  const swipe = (dir) => {
    const cardsLeft = profiles.filter((person, index) => childRefs.current[index].current !== null);
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1];
      const index = profiles.map(person => person.first_name).indexOf(toBeRemoved.first_name);
      childRefs.current[index].current.swipe(dir);
    }
  };

  const undoSwipe = () => {
    if (lastSwipedProfile) {
      setProfiles([lastSwipedProfile, ...profiles]);
      setLastSwipedProfile(null);
    }
  };

  return (
    <div className="App">
      <h1>React Tinder Card</h1>
      <div className="cardContainer">
        {profiles.map((profile, index) => (
          <TinderCard
            ref={childRefs.current[index]}
            className="swipe"
            key={profile.first_name}
            onSwipe={(dir) => swiped(dir, profile.first_name)}
            onCardLeftScreen={() => outOfFrame(profile.first_name)}
          >
            <div
              style={{ backgroundImage: `url(${profile.photo})` }}
              className="card"
            >
              <div className="card-info">
                <h2>{profile.first_name}, {profile.gender}, {profile.age}</h2>
                <p>{profile.city}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button onClick={() => swipe('left')}>Swipe left!</button>
        <button onClick={undoSwipe}>Undo swipe!</button>
        <button onClick={() => swipe('right')}>Swipe right!</button>
      </div>
      {lastDirection ? <h2 className="infoText">You swiped {lastDirection}</h2> : <h2 className="infoText">Swipe a card or press a button to get started!</h2>}
    </div>
  );
}

export default App;
