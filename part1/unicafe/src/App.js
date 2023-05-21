import { useState } from 'react'

const Heading = ({text}) => <h2>{text}</h2>

const StatisticLine = ({text, value}) => <p>{text}: {value}</p>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const Statistics = (props) => {
  const { good, neutral, bad } = props
  let total = good + neutral + bad
  
  if ( total === 0) {
    return (
      <div>
        No feedback received yet.
      </div>
    )
  }
  return (
    <div>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="Total" value={total} />
      <StatisticLine text="Average" value={ ( ( good - bad ) / total ).toFixed(2) } />
      <StatisticLine text="Positive" value={ ( good / total * 100 ).toFixed(0) + "%" } />
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
      <Button handleClick={() => setGood(good + 1)} text='Good' />
      &nbsp;
      <Button handleClick={() => setNeutral(neutral + 1)} text='Neutral' />
      &nbsp;
      <Button handleClick={() => setBad(bad + 1)} text='Bad' />
      <Heading text={stats} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
