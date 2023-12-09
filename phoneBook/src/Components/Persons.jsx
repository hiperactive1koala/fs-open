export const Persons = ({ name, number, onClick }) => {
    return (
        <div>{name} {number} <button onClick={onClick}>delete</button></div>
    );
};
