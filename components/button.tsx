import { useEffect, useState } from "react";

enum Color {
  blue = "dodgerblue",
  yellow = "#e3b307",
  green = "#57b004",
}

type Props = {
  children: string;
  color?: keyof typeof Color;
};

export function Button(props: Props) {
  const { children, color = "blue" } = props;

  let [isDesktop, setIsDesktop] = useState(false);

  // media queries not supported our of the box, so we need to do this shit
  useEffect(() => {
    const isDesktop = window.matchMedia("only screen and (min-width: 640px)");
    setIsDesktop(isDesktop.matches);

    isDesktop.addEventListener("change", updateIsDesktop);

    function updateIsDesktop(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }

    return () => {
      isDesktop.removeEventListener("change", updateIsDesktop);
    };
  }, []);

  return (
    <button>
      <span>{children}</span>

      <style jsx>
        {`
          button {
            border: 0;
            height: 3em;
            padding: 0 2em;
            border-radius: 1.5em;
            cursor: pointer;
            font-weight: bold;
            width: 100vw;
            display: block;
            outline: 0;
            background-color: currentColor;
            margin: 1em auto;
          }

          button span {
            color: white;
          }

          button:hover {
            animation-name: button-animation;
            animation-fill-mode: forwards;
            animation-duration: 0.5s;
          }

          @media only screen and (min-width: 640px) {
            .button {
            }
          }

          @keyframes button-animation {
            from {
              transform: translateY(0);
              box-shadow: none;
            }
            to {
              transform: translateY(-0.5em);
              box-shadow: 0 0.5em 0 0 #ddd;
            }
          }
        `}
      </style>

      <style jsx>
        {`
          // dynamic styles
          button {
            color: ${Color[color]};
            width: ${isDesktop === true ? "100%" : "100vw"};
          }
        `}
      </style>
    </button>
  );
}
