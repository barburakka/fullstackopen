const Course = ({course}) => 
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>

const Header = ({ name }) => <h1>{name}</h1>

const Total = ({ parts }) => {
  const exercises = parts.map(part => part.exercises)
  const sum = exercises.reduce( (accumulator, currentValue) => accumulator + currentValue )
  
  return ( <p><b>Total of {sum} exercises</b></p> )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </>

export default Course