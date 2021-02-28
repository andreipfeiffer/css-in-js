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

  const button_styles = style9(styles.button, button_color[color]);

  return (
    <button onClick={onClick} className={button_styles}>
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
    borderRadius: "1.5em",
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
          boxShadow: "none",
        },
        to: {
          transform: "translateY(-0.5em)",
          boxShadow: "0 0.5em 0 0 #ddd",
        },
      }),
      animationFillMode: "forwards",
      animationDuration: "0.5s",
    },

    "@media": {
      "(min-width: 640px)": {
        width: "100%",
      },
    },
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

const button_color = style9.create<typeof Color>({
  blue: {
    color: BLUE,
  },
  green: {
    color: GREEN,
  },
  yellow: {
    color: YELLOW,
  },
  red: {
    color: RED,
  },
  grey: {
    color: GREY,
  },
});
