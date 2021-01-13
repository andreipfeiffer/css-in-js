import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { renderToNodeList } from "react-fela";

import getFelaRenderer from "../getFelaRenderer";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const renderer = getFelaRenderer();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => <App {...props} renderer={renderer} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = renderToNodeList(renderer);
    return {
      ...initialProps,
      styles: [...initialProps.styles, ...styles],
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
