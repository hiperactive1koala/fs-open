
const Part = ({ part }) => (<p>{part.name} {part.exercises}</p>);

const Total = ({ parts }) => {
    const total = parts.reduce((s, p) => {
        return s + p.exercises;
    }, 0);
    return (
        <h3>total of {total} exercises</h3>
    );
};

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => <Part key={part.id} part={part} />)}
        </div>
    );
};
const SubHeader = ({ text }) => (<h2>{text}</h2>);

const Course = ({ course }) => {
    return (
        <div>
            <SubHeader text={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
};

export default Course


