const Alert = ({validationMessages}) => {
    return (
        <div className="alert-container">
        <ul>
          {validationMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    );
};

export default Alert;