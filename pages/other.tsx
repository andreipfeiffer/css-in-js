import { useRouter } from "next/router";
import css from "styled-jsx/css";
import { Button } from "../components/button";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <Button onClick={() => router.back()}>Go Back</Button>

      <h1 className="heading">Another route</h1>

      <p>
        Styles should be code-splitted, loaded only when the route is loaded.
      </p>

      <p>
        The button is loaded on the main route also, so it should not be fetched
        twice.
      </p>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = css`
  div {
    max-width: 75vw;
  }

  .heading {
    font-size: 1.5rem;
  }
`;
