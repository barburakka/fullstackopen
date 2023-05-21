import { useState } from 'react'

const StatisticRow = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

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
      <table>
        <tbody>
          <StatisticRow text="Good" value={good} />
          <StatisticRow text="Neutral" value={neutral} />
          <StatisticRow text="Bad" value={bad} />
          <StatisticRow text="Total" value={total} />
          <StatisticRow text="Average" value={ ( ( good - bad ) / total ).toFixed(1) } />
          <StatisticRow text="Positive" value={ ( good / total * 100 ).toFixed(1) + "%" } />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>Please rate your experience below:</h2>
      <Button handleClick={() => setGood(good + 1)} text='Good' />
      &nbsp;
      <Button handleClick={() => setNeutral(neutral + 1)} text='Neutral' />
      &nbsp;
      <Button handleClick={() => setBad(bad + 1)} text='Bad' />
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
