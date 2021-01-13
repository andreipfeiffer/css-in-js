import { useRouter } from "next/router";
import { useFela } from "react-fela";
import { Button } from "../components/button";

export default function Home() {
  const router = useRouter();
  const { css } = useFela();

  return (
    <main>
      <Button onClick={() => router.back()}>Go Back</Button>

      {/* styles can be declared directly inside the component */}
      <h1
        className={css({
          maxWidth: "75vw",
          fontSize: "1.5rem",
        })}
      >
        Another route
      </h1>

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
