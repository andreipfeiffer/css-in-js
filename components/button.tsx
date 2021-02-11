import style9 from "style9";

// @todo cannot use Enums/Objects
const BLUE = "dodgerblue";
const GREEN = "#57b004";
const GREY = "#cccccc";
const RED = "#db2e02";
const YELLOW = "#e3b307";

const Color = {
  grey: GREY,
  blue: BLUE,
  yellow: YELLOW,
  green: GREEN,
  red: RED,
};

type Props = {
  children: string;
  color?: keyof typeof Color;
  onClick?(): void;
};

export function Button(props: Props) {
  const { children, color = "grey", onClick } = props;

  return (
    <button
      onClick={onClick}
      className={styles("button", {
        // @todo cannot use dynamic styling here, so we have to repeat ourselves
        button_green: color === "green",
        button_blue: color === "blue",
        button_grey: color === "grey",
        button_red: color === "red",
        button_yellow: color === "yellow",
      })}
    >
      <span className={styles("text")}>{children}</span>
    </button>
  );
}

const styles = style9.create({
  button: {
    borderWidth: 0,
    height: "3em",
    padding: "2em",
    paddingTop: 0,
    paddingBottom: 0,
    // @todo cannot use string
    // borderRadius: "1.5em",
    borderRadius: 24,
    cursor: "pointer",
    fontWeight: "bold",
    width: "100vw",
    display: "block",
    outlineWidth: 0,
    backgroundColor: "currentColor",
    margin: "1em",
    marginLeft: "auto",
    marginRight: "auto",

    ":hover": {
      animationName: style9.keyframes({
        from: {
          transform: "translateY(0)",
          // @todo boxShadow not supported
          boxShadow: "none",
        },
        to: {
          transform: "translateY(-0.5em)",
          // @todo boxShadow not supported
          boxShadow: "0 0.5em 0 0 #ddd",
        },
      }),
      animationFillMode: "forwards",
      animationDuration: "0.5s",
    },

    // @todo media queries thow a runtime exception
    // ["@media (min-width: 640px)" as any]: {
    //   width: "100%",
    // },
  },

  button_blue: {
    color: BLUE,
  },
  button_green: {
    color: GREEN,
  },
  button_yellow: {
    color: YELLOW,
  },
  button_red: {
    color: RED,
  },
  button_grey: {
    color: GREY,
  },

  text: {
    color: "white",
  },

  // the following styled should be ignored, as they are not needed
  unused_styles: {
    color: "red",
    borderWidth: 0,
    height: "3em",
    padding: "0 2em",
    borderRadius: 24,
    cursor: "pointer",
    fontWeight: "bold",
    width: "100vw",
    display: "block",
    outlineWidth: 0,
    backgroundColor: "currentColor",
    margin: "1em auto",
  },
});
