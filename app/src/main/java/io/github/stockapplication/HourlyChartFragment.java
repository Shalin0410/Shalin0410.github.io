package io.github.stockapplication;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.fragment.app.Fragment;

public class HourlyChartFragment extends Fragment {

    private String chartHTML;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        chartHTML = "<h1>Hello Hourly Chart</h1>";
        View view = inflater.inflate(R.layout.fragment_hourly_chart, container, false);
        WebView webView = view.findViewById(R.id.hourly_chart_webView);
        webView.loadDataWithBaseURL(null, chartHTML, "text/html", "UTF-8", null);
        //webView.getSettings().setJavaScriptEnabled(true);
        return view;
    }
}