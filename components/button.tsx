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

  // @todo dynamic styles require some boilerplate/hacks
  // don't have a way to define variants for a single style (like "button")
  // since the "styles" contain a list of elements
  const button_styles = style9(
    styles.button,
    styles[`button_${color}` as const]
  );

  return (
    <button onClick={onClick} className={button_styles}>
      <span className={styles("text")}>{children}</span>
    </button>
  );
}

// @todo this is currently a hack, as MQ are not fully supported yet
const media: any = "@media (min-width: 640px)";

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

    [media]: {
      width: "100%",
    },
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
