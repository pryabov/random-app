import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Topic {
  topicName: string;
  requiredAmountOfPeople: number;
  selectedPersons?: string[];
}

const App: React.FC = () => {
  const [persons, setPersons] = useState<string[]>(['Alice', 'Bob', 'Charlie']);
  const [topics, setTopics] = useState<Topic[]>([
    { topicName: 'Topic 1', requiredAmountOfPeople: 2 },
    { topicName: 'Topic 2', requiredAmountOfPeople: 2 },
    { topicName: 'Topic 3', requiredAmountOfPeople: 3 },
    { topicName: 'Topic 4', requiredAmountOfPeople: 2 },
  ]);
  const [output, setOutput] = useState<JSX.Element[]>([]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      // todo: use crypto.getRandomValues() for better randomness\
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const randomizeTopics = () => {
    const shuffledPersons = [...persons];
    const outputList: JSX.Element[] = [];

    shuffleArray(shuffledPersons);
    let availablePersons = [...shuffledPersons];

    let iteration = 0;

    for (const topic of topics) {
      const topicPersons: JSX.Element[] = [];
      while (topicPersons.length < topic.requiredAmountOfPeople) {
        if (availablePersons.length === 0) {
          availablePersons = [...shuffledPersons];
          iteration++;
        }

        topicPersons.push(...availablePersons.splice(0, topic.requiredAmountOfPeople - topicPersons.length).map((person) => {
          const hue = (iteration * 40) % 360;
          return <span style={{ color: `hsl(${hue}, 100%, 50%)` }}>{person}</span>;
        }));
      }

      outputList.push(
        <li key={topic.topicName}>
          {topic.topicName}: {topicPersons.reduce((prev, curr) => [prev, ', ', curr])}
        </li>
      );
    }

    setOutput(outputList);
  };

  const addPerson = () => {
    setPersons([...persons, '']);
  };

  const removePerson = (index: number) => {
    const newPersons = [...persons];
    newPersons.splice(index, 1);
    setPersons(newPersons);
  };

  const addTopic = () => {
    setTopics([...topics, { topicName: '', requiredAmountOfPeople: 0 }]);
  };

  const removeTopic = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Topic Randomizer</h1>

      <div className="mb-3">
        {persons.map((person, index) => (
          <div className="row mb-2" key={index}>
            <div className="col">
              <label className="form-label">Person</label>
              <input
                className="form-control"
                value={person}
                onChange={(e) => {
                  const newPersons = [...persons];
                  newPersons[index] = e.target.value;
                  setPersons(newPersons);
                }}
              />
            </div>
            <div className="col d-flex align-items-end">
              <button className="btn btn-danger" onClick={() => removePerson(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <button className="btn btn-success" onClick={addPerson}>
          Add Person
        </button>
      </div>

      <div className="mb-3">
        {topics.map((topic, index) => (
          <div className="row mb-2" key={index}>
            <div className="col">
              <label className="form-label">Topic Name</label>
              <input
                className="form-control"
                value={topic.topicName}
                onChange={(e) => {
                  const newTopics = [...topics];
                  newTopics[index].topicName = e.target.value;
                  setTopics(newTopics);
                }}
              />
            </div>
            <div className="col">
              <label className="form-label">Required Amount of People</label>
              <input
                className="form-control"
                type="number"
                value={topic.requiredAmountOfPeople}
                onChange={(e) => {
                  const newTopics = [...topics];
                  newTopics[index].requiredAmountOfPeople = parseInt(e.target.value, 10);
                  setTopics(newTopics);
                }}
              />
            </div>
            <div className="col d-flex align-items-end">
              <button className="btn btn-danger" onClick={() => removeTopic(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <button className="btn btn-success" onClick={addTopic}>
          Add Topic
        </button>
      </div>
      
      <div className="mt-4">
        <button className="btn btn-primary" onClick={randomizeTopics}>
          Run Random Operation
        </button>
      </div>

      <div className="mt-4">
        <h2>Output</h2>
        <ul>
          {output}
        </ul>
      </div>
    </div>
  );
};

export default App;
