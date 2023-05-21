import { useState } from 'react'

const Heading = ({text}) => <h2>{text}</h2>

const Statistics = (props) => {
  console.log(props)
  const { good, neutral, bad } = props
  
  return (
    <div>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>Total: {good + neutral + bad}</p>
      <p>Average: { ( good - bad ) / ( good + neutral + bad) }</p>
      <p>Positive: { good / ( good + neutral + bad) * 100 }%</p>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const prompt = 'Please rate your experience below:'
  const stats = 'Statistics'

  return (
    <div>
      <Heading text={prompt} />
      <button onClick={() => setGood(good + 1)}>Good</button>
      &nbsp;
      <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
      &nbsp;
      <button onClick={() => setBad(bad + 1)}>Bad</button>
      <Heading text={stats} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
