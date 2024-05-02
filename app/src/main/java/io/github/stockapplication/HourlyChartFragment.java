package io.github.stockapplication;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.fragment.app.Fragment;

public class HourlyChartFragment extends Fragment {
    private String symbol;

    public HourlyChartFragment(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_hourly_chart, container, false);
        WebView webView = view.findViewById(R.id.hourly_chart_webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(view.getContext(), symbol), "Android");
        //webView.loadDataWithBaseURL(null, chartHTML, "text/html", "UTF-8", null);
        webView.loadUrl("file:///android_asset/hourlyChart.html");
        return view;
    }
}