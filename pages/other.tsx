import { useRouter } from "next/router";
import { styled } from "@compiled/react";
import { Button } from "../components/button";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <Button onClick={() => router.back()}>Go Back</Button>

      <Heading>Another route</Heading>

      <p>
        Styles should be code-splitted, loaded only when the route is loaded.
      </p>

      <p>
        The button is loaded on the main route also, so it should not be fetched
        twice.
      </p>
    </main>
  );
}

// styled components api
const Heading = styled.h1`
  max-width: 75vw;
  font-size: 1.5rem;
`;

// object syntax is also supported
// const Heading = styled.h1({
//   maxWidth: "75vw",
//   fontSize: "1.5rem",
// });
