import { styled } from '@linaria/react';

const Box = styled.div`
  margin-top: 40px;
  margin-left: 40px;
  height: 200px;
  width: 200px;
  background-color: tomato;
  animation: spin 2s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`

export default function Page() {
  return (
    <main>
      <h1>Index page</h1>
      <Box>Hello, Linaria!</Box>
    </main>
  );
}
