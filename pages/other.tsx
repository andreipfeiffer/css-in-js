import { useRouter } from "next/router";
import { Button } from "../components/button";

import styles from "../styles/other.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <Button onClick={() => router.back()}>Go Back</Button>

      <h1 className={styles.heading}>Another route</h1>

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
