import Document, { DocumentContext } from "next/document";
import { getStyles } from "typestyle";

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {
            <style
              id="styles-target"
              dangerouslySetInnerHTML={{
                __html: getStyles(),
              }}
            ></style>
          }
        </>
      ),
    };
  }
}
