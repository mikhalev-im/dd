interface ErrorProps {
  error: Error;
}

const toString = (err: Error) => {
  if (err.message) return `Error: ${err.message}`;
  return JSON.stringify(err);
}

const Error = ({ error }: ErrorProps) => {
  return (
    <div>
      <p>Ой! Возникла какая-то ошибка!</p>
      <details>
        <summary>Подробности</summary>
        <p>{toString(error)}</p>
      </details>
    </div>
  );
}

export default Error;
