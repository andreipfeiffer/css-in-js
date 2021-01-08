import { useState } from "react";
import Link from "next/link";
import { Button } from "../components/button";
import { Input } from "../components/input";

export default function Home() {
  const [showButtons, toggleButtons] = useState(false);
  const [width, setWidth] = useState(100);

  return (
    <main>
      <Link href="/other" prefetch={false}>
        <a>Other page</a>
      </Link>

      <Button color="blue" onClick={() => toggleButtons(true)}>
        Show other buttons
      </Button>

      {showButtons && (
        <>
          <Button color="yellow">Yellow button</Button>
          <Button color="green">Green button</Button>
          <Button color="red">Red button</Button>
        </>
      )}

      <Input value={width} onChange={(val) => setWidth(val)} />
    </main>
  );
}
