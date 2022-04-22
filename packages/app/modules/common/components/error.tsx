interface ErrorProps {
  error: Error;
}

const Error = ({ error }: ErrorProps) => {
  return (
    <div>
      <p>Ой! Возникла какая-то ошибка!</p>
      <details>
        <summary>Подробности</summary>
        <p>{error.toString()}</p>
      </details>
    </div>
  );
}

export default Error;