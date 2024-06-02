import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';

const Simple = () => {
  const [db, setDb] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setDb(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete);
  };

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  };

  return (
    <div>
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      <h1>React Tinder Card</h1>
      <div className='cardContainer'>
        {db.map((character) => (
          <TinderCard
            className='swipe'
            key={character.first_name + character.age + character.gender + character.city}
            onSwipe={(dir) => swiped(dir, character.first_name)}
            onCardLeftScreen={() => outOfFrame(character.first_name)}
          >
            <div
              style={{ backgroundImage: 'url(' + character.picture + ')' }}
              className='card'
            >
              <h3>{character.first_name}, {character.age}, {character.gender}, {character.city}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default Simple;
