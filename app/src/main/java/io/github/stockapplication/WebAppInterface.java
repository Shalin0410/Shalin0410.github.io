package io.github.stockapplication;

import android.content.Context;
import android.webkit.JavascriptInterface;

public class WebAppInterface {
    Context mContext;
    String symbol;

    /** Instantiate the interface and set the context. */
    WebAppInterface(Context c, String s) {
        this.mContext = c;
        this.symbol = s;
    }

    /**
     * Show a toast from the web page.
     *
     * @return
     */
    @JavascriptInterface
    public String getSymbol() {
        return symbol;
    }
}
