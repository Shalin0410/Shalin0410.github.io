package io.github.stockapplication;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.SpannableString;
import android.text.TextWatcher;
import android.text.style.UnderlineSpan;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StockDetailActivity extends AppCompatActivity {
    private Handler apiUpdateHandler = new Handler();
    private Runnable apiUpdateRunnable;
    TabLayout tabLayout;
    ViewPager2 viewPager2;
    ViewPagerAdapter viewPagerAdapter;
    RecyclerView peers;
    TextView webpage;
    String webURL = "";

    ActionBar actionBar;
    String stockSymbol;
    boolean isFavorite;
    double walletBalance;
    int quantity;
    double totalCost;
    double avgCost;
    private Button button;
    private EditText numOfStocks;
    private Button buyButton;
    private Button sellButton;
    private Button doneButton;
    int numOfSharesTraded;
    JSONObject companyProfile;
    JSONObject companyQuote;
    JSONArray companyNews;
    JSONArray companyRecommendation;
    JSONObject companySentiment;
    JSONArray companyPeers;
    JSONArray companyEarnings;
    JSONObject companyCharts;
    JSONObject companyHourlyCharts;

    RequestQueue requestQueue;
    String apiURI = "https://assign2shalin.wl.r.appspot.com";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_stock_detail);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        walletBalance = 0;
        quantity = 0;
        totalCost = 0;
        avgCost = 0;
        isFavorite = false;

        findViewById(R.id.contentSD).setVisibility(View.GONE);
        findViewById(R.id.progressBarSD).setVisibility(View.VISIBLE);
        requestQueue = Volley.newRequestQueue(this);
        stockSymbol = getIntent().getStringExtra("symbol");
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setTitle(stockSymbol);
            actionBar.setDisplayHomeAsUpEnabled(true);
            //actionBar.setDisplayShowHomeEnabled(true);
        }
        tabLayout = findViewById(R.id.tabLayout);
        viewPager2 = findViewById(R.id.viewPager);
        viewPagerAdapter = new ViewPagerAdapter(this);
        viewPager2.setAdapter(viewPagerAdapter);
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                viewPager2.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        viewPager2.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                tabLayout.getTabAt(position).select();
            }
        });
        apiUpdateRunnable = new Runnable() {
            @Override
            public void run() {
                Log.i("StockDetailActivity", "Updating Company Profile");
                fetchCompanyQuote();
                apiUpdateHandler.postDelayed(this, 15000);
            }
        };
        apiUpdateHandler.post(apiUpdateRunnable);

        fetchData();

        //Stock Trading Code
        button = findViewById(R.id.tradingBtnSD);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                numOfSharesTraded = 0;
                final Dialog dialog = new Dialog(StockDetailActivity.this);
                dialog.setContentView(R.layout.trading_dialogue);
                TextView textView = (TextView) dialog.findViewById(R.id.tradingTitle);
                String title = "Trade " + companyProfile.optString("name") + " shares";
                textView.setText(title);
                textView = (TextView) dialog.findViewById(R.id.resultTrade);
                textView.setText("*$" + String.format("%.2f", companyQuote.optDouble("c")) + "/share = 0.00");
                textView = (TextView) dialog.findViewById(R.id.walletRemaining);
                textView.setText("$" + String.format("%.2f", walletBalance) + " to buy " + stockSymbol);
                DisplayMetrics metrics = getResources().getDisplayMetrics();
                int width = metrics.widthPixels;
                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.getWindow().setLayout(width, WindowManager.LayoutParams.WRAP_CONTENT);
                dialog.show();
                numOfStocks = (EditText) dialog.findViewById(R.id.editStockNum);
                buyButton = dialog.findViewById(R.id.buyBtn);
                sellButton = dialog.findViewById(R.id.sellBtn);
                numOfStocks.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                    }

                    @Override
                    public void onTextChanged(CharSequence s, int start, int before, int count) {
                        try {
                            TextView textView = dialog.findViewById(R.id.linkNumOfShares);
                            TextView resultTextView = dialog.findViewById(R.id.resultTrade);
                            Log.i("StockDetailActivity", "Number of Shares: " + s.toString());
                            if (!s.toString().isEmpty() && Integer.parseInt(s.toString()) > 0) {
                                int numberOfShares = Integer.parseInt(s.toString());
                                textView.setText(String.valueOf(numberOfShares));
                                double pricePerShare = companyQuote.optDouble("c");
                                double result = pricePerShare * numberOfShares;
                                resultTextView.setText("*$" + String.format("%.2f", pricePerShare) + "/share = " + String.format("%.2f", result));
                            } else {
                                resultTextView.setText("*$" + String.format("%.2f", companyQuote.optDouble("c")) + "/share = 0.00");
                            }
                        } catch (NumberFormatException e) {
                            Log.e("StockDetailActivity", "Error parsing number", e);
                        }
                    }

                    @Override
                    public void afterTextChanged(Editable s) {
                        numOfSharesTraded = Integer.parseInt(s.toString());
                        Log.i("StockDetailActivity", "Number of Shares Planning To Trade: " + numOfSharesTraded);

                    }
                });
                buyButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (numOfSharesTraded > 0 ) {
                            if (numOfSharesTraded * companyQuote.optDouble("c") <= walletBalance) {
                                walletBalance -= numOfSharesTraded * companyQuote.optDouble("c");
                                quantity += numOfSharesTraded;
                                totalCost += numOfSharesTraded * companyQuote.optDouble("c");
                                avgCost = totalCost / quantity;
                                Log.i("StockDetailActivity", "Buy Quantity: " + quantity);
                                Log.i("StockDetailActivity", "Buy Total Cost: " + totalCost);
                                Log.i("StockDetailActivity", "Buy Avg Cost: " + avgCost);
                                updatePortfolio(walletBalance, quantity, totalCost);
                                dialog.dismiss();
                                final Dialog dialog = new Dialog(StockDetailActivity.this);
                                dialog.setContentView(R.layout.congrats_dialogue);
                                TextView textView = (TextView) dialog.findViewById(R.id.messageTrade);
                                String title = "You have successfully bought " + numOfSharesTraded + " shares of " + stockSymbol;
                                textView.setText(title);
                                doneButton = dialog.findViewById(R.id.doneBtn);
                                DisplayMetrics metrics = getResources().getDisplayMetrics();
                                int width = metrics.widthPixels;
                                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                                dialog.getWindow().setLayout(width, WindowManager.LayoutParams.WRAP_CONTENT);
                                dialog.show();
                                doneButton.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {
                                        dialog.dismiss();
                                    }
                                });

                            } else {
                                Toast.makeText(StockDetailActivity.this, "Not enough money to buy", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(StockDetailActivity.this, "Cannot buy non-positive shares", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
                sellButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (numOfSharesTraded > 0) {
                            if (quantity >= numOfSharesTraded) {
                                walletBalance += numOfSharesTraded * companyQuote.optDouble("c");
                                quantity -= numOfSharesTraded;
                                totalCost -= numOfSharesTraded * avgCost;
                                if (quantity <= 0){
                                    avgCost = 0;
                                } else {
                                    avgCost = totalCost / quantity;
                                }
                                Log.i("StockDetailActivity", "Sell Quantity: " + quantity);
                                Log.i("StockDetailActivity", "Sell Total Cost: " + totalCost);
                                Log.i("StockDetailActivity", "Sell Avg Cost: " + avgCost);
                                updatePortfolio(walletBalance, quantity, totalCost);
                                dialog.dismiss();
                                final Dialog dialog = new Dialog(StockDetailActivity.this);
                                dialog.setContentView(R.layout.congrats_dialogue);
                                TextView textView = (TextView) dialog.findViewById(R.id.messageTrade);
                                String title = "You have successfully sold " + numOfSharesTraded + " shares of " + stockSymbol;
                                textView.setText(title);
                                doneButton = dialog.findViewById(R.id.doneBtn);
                                DisplayMetrics metrics = getResources().getDisplayMetrics();
                                int width = metrics.widthPixels;
                                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                                dialog.getWindow().setLayout(width, WindowManager.LayoutParams.WRAP_CONTENT);
                                dialog.show();
                                doneButton.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {
                                        dialog.dismiss();
                                    }
                                });

                            } else {
                                Toast.makeText(StockDetailActivity.this, "Not enough shares to sell", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(StockDetailActivity.this, "Cannot sell non-positive shares", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });

        webpage = findViewById(R.id.valWebpageSD);
        webpage.setOnClickListener(new View.OnClickListener() {
            @Override
                    public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(webURL));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        });
    }
    private void setContents() {
        setCompanyProfile();
        setPortfolio();
        setStats();
        setAbout();
        setInsights();

        findViewById(R.id.contentSD).setVisibility(View.VISIBLE);
        findViewById(R.id.progressBarSD).setVisibility(View.GONE);
        invalidateOptionsMenu();
    }
    private void setCompanyProfile() {
        if (companyProfile != null) {
            ImageView imageView = findViewById(R.id.companyLogoSD);
            String imageURL = companyProfile.optString("logo", "");
            if (imageURL != null) {
                Picasso.get().load(imageURL).into(imageView);
            }
            TextView textView = findViewById(R.id.symbolSD);
            textView.setText(companyProfile.optString("ticker", ""));

            textView = findViewById(R.id.companySD);
            textView.setText(companyProfile.optString("name", ""));
            textView = findViewById(R.id.currentPriceSD);
            textView.setText("$" + String.format("%.2f", companyQuote.optDouble("c")));
            textView = findViewById(R.id.changeInPriceSD);
            double change = companyQuote.optDouble("d");
            double changeInPercent = companyQuote.optDouble("dp");
            if (change > 0) {
                textView.setTextColor(Color.GREEN);
                imageView = findViewById(R.id.trendingSD);
                imageView.setImageResource(R.drawable.trending_up);
            } else {
                textView.setTextColor(Color.RED);
                imageView = findViewById(R.id.trendingSD);
                imageView.setImageResource(R.drawable.trending_down);
            }
            textView.setText("$" + String.format("%.2f", change) + " (" + String.format("%.2f", changeInPercent) + "%)");
        }
    }
    private void setPortfolio() {
        Log.i("StockDetailActivity", "Quantity: " + quantity);
        Log.i("StockDetailActivity", "Total Cost: " + totalCost);
        Log.i("StockDetailActivity", "Avg Cost: " + avgCost);
        TextView textView = findViewById(R.id.numSharesSD);
        textView.setText(String.valueOf(quantity));
        textView = findViewById(R.id.numAvgCostPerShareSD);
        textView.setText("$" + String.format("%.2f", avgCost));
        textView = findViewById(R.id.numTotalCostSD);
        textView.setText("$" + String.format("%.2f", totalCost));
        textView = findViewById(R.id.numChangeSD);
        double change = companyQuote.optDouble("c") - avgCost;
        if (quantity > 0) {
            if (change > 0) {
                textView.setTextColor(Color.GREEN);
                textView.setText("$" + String.format("%.2f", change));
                textView = findViewById(R.id.numMarketValSD);
                textView.setTextColor(Color.GREEN);
                double marketVal = companyQuote.optDouble("c") * quantity;
                textView.setText("$" + String.format("%.2f", marketVal));
            } else if (change < 0) {
                textView.setTextColor(Color.RED);
                textView.setText("$" + String.format("%.2f", change));
                textView = findViewById(R.id.numMarketValSD);
                textView.setTextColor(Color.RED);
                double marketVal = companyQuote.optDouble("c") * quantity;
                textView.setText("$" + String.format("%.2f", marketVal));
            } else {
                textView.setTextColor(Color.BLACK);
                textView.setText("$" + String.format("%.2f", change));
                textView = findViewById(R.id.numMarketValSD);
                textView.setTextColor(Color.BLACK);
                double marketVal = companyQuote.optDouble("c") * quantity;
                textView.setText("$" + String.format("%.2f", marketVal));
            }
        } else {
            textView.setTextColor(Color.BLACK);
            textView.setText("$" + String.format("%.2f", change));
            textView = findViewById(R.id.numMarketValSD);
            textView.setTextColor(Color.BLACK);
            double marketVal = companyQuote.optDouble("c") * quantity;
            textView.setText("$" + String.format("%.2f", marketVal));
        }
    }
    private void setStats() {
        TextView textView = findViewById(R.id.valOpenPriceSD);
        textView.setText("$" + String.format("%.2f", companyQuote.optDouble("o")));
        textView = findViewById(R.id.valHighPriceSD);
        textView.setText("$" + String.format("%.2f", companyQuote.optDouble("h")));
        textView = findViewById(R.id.valLowPriceSD);
        textView.setText("$" + String.format("%.2f", companyQuote.optDouble("l")));
        textView = findViewById(R.id.valPrevCloseSD);
        textView.setText("$" + String.format("%.2f", companyQuote.optDouble("pc")));
    }
    private void setAbout() {
        TextView textView = findViewById(R.id.valIPOSD);
        textView.setText(companyProfile.optString("ipo", ""));
        Log.i("StockDetailActivity", "IPO Date: " + companyProfile.optString("ipo", ""));
        textView = findViewById(R.id.valIndustrySD);
        textView.setText(companyProfile.optString("finnhubIndustry", ""));
        Log.i("StockDetailActivity", "Industry: " + companyProfile.optString("finnhubIndustry", ""));
        webURL = companyProfile.optString("weburl", "");
        SpannableString content = new SpannableString(webURL);
        content.setSpan(new UnderlineSpan(), 0, webURL.length(), 0);
        webpage.setText(content);
        Log.i("StockDetailActivity", "Webpage: " + companyProfile.optString("weburl", ""));
        peers = (RecyclerView) findViewById(R.id.valPeersSD);
        List<String> list = new ArrayList<>();
        try {

            for (int i = 0; i < companyPeers.length(); i++) {
                if (i != companyPeers.length() - 1){
                    list.add(companyPeers.getString(i) + ", ");
                }
                else {
                    list.add(companyPeers.getString(i));
                }
            }
        } catch (JSONException e) {
            Log.i("StockDetailActivity", "Issue In Printing Peers Error: " + e.getMessage());
        }
        Log.i("StockDetailActivity", "Peers: " + list);
    }

    private void setInsights() {
        double totMSPR = 0.0;
        double posMSPR = 0.0;
        double negMSPR = 0.0;
        int totChange = 0;
        int posChange = 0;
        int negChange = 0;
        TextView textView = findViewById(R.id.tableCompanyNameSD);
        textView.setText(companyProfile.optString("name", ""));
        JSONArray data = companySentiment.optJSONArray("data");
        for (int i = 0; i < data.length(); i++) {
            JSONObject obj = data.optJSONObject(i);
            if (obj.optInt("change") > 0) {
                totChange = totChange + obj.optInt("change");
                posChange = posChange + obj.optInt("change");
            } else {
                totChange = totChange + obj.optInt("change");
                negChange = negChange + obj.optInt("change");
            }
            if (obj.optDouble("mspr") > 0) {
                totMSPR = totMSPR + obj.optDouble("mspr");
                posMSPR = posMSPR + obj.optDouble("mspr");
            } else {
                totMSPR = totMSPR + obj.optDouble("mspr");
                negMSPR = negMSPR + obj.optDouble("mspr");
            }
        }
        textView = findViewById(R.id.valTotalMSRPSD);
        textView.setText(String.valueOf(totMSPR));
        textView = findViewById(R.id.valPosMSRPSD);
        textView.setText(String.valueOf(posMSPR));
        textView = findViewById(R.id.valNegMSRPSD);
        textView.setText(String.valueOf(negMSPR));
        textView = findViewById(R.id.valTotalChangeSD);
        textView.setText(String.valueOf(totChange));
        textView = findViewById(R.id.valPosChangeSD);
        textView.setText(String.valueOf(posChange));
        textView = findViewById(R.id.valNegChangeSD);
        textView.setText(String.valueOf(negChange));
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Log.i("StockDetailActivity", "onOptionsItemSelected");
        Log.i("StockDetailActivity", "item.getItemId(): " + item.getItemId());
        Log.i("StockDetailActivity", "R.id.action_favorite: " + R.id.action_favorite);
        int itemId = item.getItemId();
        if (itemId == android.R.id.home) {
            finish();
            return true;
        } else if (itemId == R.id.action_favorite) {
            Toast.makeText(this, stockSymbol + " is removed from favorites", Toast.LENGTH_SHORT).show();
            updateFavorite(false);
            return true;
        } else if (itemId == R.id.action_not_favorite) {
            Toast.makeText(this, stockSymbol + " is added to favorites", Toast.LENGTH_SHORT).show();
            updateFavorite(true);
            return true;
        }
        return false;
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        Log.i("StockDetailActivity", "onCreateOptionsMenu");
        getMenuInflater().inflate(R.menu.action_buttons, menu);
        if (findViewById(R.id.progressBarSD).getVisibility() == View.GONE){
            Log.i("StockDetailActivity", "onCreateOptionsMenu: " + isFavorite);
            if (isFavorite) {
                MenuItem item = menu.findItem(R.id.action_favorite);
                item.setVisible(true);
                item = menu.findItem(R.id.action_not_favorite);
                item.setVisible(false);
            } else {
                MenuItem item = menu.findItem(R.id.action_favorite);
                item.setVisible(false);
                item = menu.findItem(R.id.action_not_favorite);
                item.setVisible(true);
            }
        }
        return true;
    }
//    @Override
//    public boolean onPrepareOptionsMenu(Menu menu) {
//        Log.i("StockDetailActivity", "onPrepareOptionsMenu");
//        if (isFavorite) {
//            MenuItem item = menu.findItem(R.id.action_favorite);
//            item.setVisible(true);
//            item = menu.findItem(R.id.action_not_favorite);
//            item.setVisible(false);
//        } else {
//            MenuItem item = menu.findItem(R.id.action_favorite);
//            item.setVisible(false);
//            item = menu.findItem(R.id.action_not_favorite);
//            item.setVisible(true);
//        }
//        return true;
//    }



    private void fetchData() {
        fetchCompanyProfile();
    }

    private void fetchCompanyProfile() {
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/search/" + stockSymbol, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("StockDetailActivity", "Response from company profile: " + response.toString());
                        companyProfile = response;
                        fetchCompanyNews();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyQuote() {
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/quote/" + stockSymbol, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("StockDetailActivity", "Response from company quote: " + response.toString());
                        companyQuote = response;
                        setCompanyProfile();
                        setPortfolio();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyNews() {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/news/" + stockSymbol, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("StockDetailActivity", "Response from company news: " + response.toString());
                        companyNews = response;
                        fetchCompanyRecommendation();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyRecommendation() {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/recommendation/" + stockSymbol, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("StockDetailActivity", "Response from company recommendation: " + response.toString());
                        companyRecommendation = response;
                        fetchCompanySentiment();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanySentiment() {
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/sentiment/" + stockSymbol, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("StockDetailActivity", "Response from company sentiment: " + response.toString());
                        companySentiment = response;
                        fetchCompanyPeers();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyPeers() {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/peers/" + stockSymbol, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("StockDetailActivity", "Response from company peers: " + response.toString());
                        companyPeers = response;
                        fetchCompanyEarnings();
                        }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyEarnings() {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/earnings/" + stockSymbol, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("StockDetailActivity", "Response from company earnings: " + response.toString());
                        companyEarnings = response;
                        fetchCompanyCharts();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyCharts() {
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/charts/" + stockSymbol, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("StockDetailActivity", "Response from company charts: " + response.toString());
                        companyCharts = response;
                        fetchCompanyHourlyCharts();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchCompanyHourlyCharts() {
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/hourlyCharts/" + stockSymbol, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("StockDetailActivity", "Response from company hourly charts: " + response.toString());
                        companyHourlyCharts = response;
                        fetchIsFavorite();
                        }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }
    private void fetchIsFavorite() {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/watchlist", null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("StockDetailActivity", "Response From Watchlist MongoDB: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                Log.i("StockDetailActivity", "Individial DB Wathclist Stock: " + response.getJSONObject(i));
                                JSONObject stock = response.getJSONObject(i);
                                isFavorite = stock.getString("symbols").equals(stockSymbol);
                                Log.i("StockDetailActivity", "isFavorite: " + isFavorite);
                                if (isFavorite) {
                                    Log.i("StockDetailActivity", "Exiting For Loop");
                                    break;
                                }
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        Log.i("StockDetailActivity", "Invalidating Menu");
                        fetchWallet();
                    }
                    },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                        }
                });
        requestQueue.add(request);
    }
    private void fetchWallet() {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, apiURI + "/wallet",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        response = response.replace("\"", "");
                        walletBalance = Double.parseDouble(response);
                        Log.i("StockDetailActivity", "Cash Balance: " + response);
                        fetchPortfolio();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("myTag", "Error: " + error.getMessage());
            }
        });
        requestQueue.add(stringRequest);
    }

    private void fetchPortfolio() {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/portfolio", null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("StockDetailActivity", "Response From Portfolio MongoDB: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                Log.i("StockDetailActivity", "Individial DB Stock: " + response.getJSONObject(i));
                                JSONObject stock = response.getJSONObject(i);
                                if (stockSymbol.equals(stock.getString("symbols"))){
                                    quantity = stock.getInt("quantity");
                                    totalCost = Double.parseDouble(stock.getString("totalCost"));
                                    avgCost = Double.parseDouble(stock.getString("avgCost"));
                                    Log.i("StockDetailActivity", "Quantity: " + quantity);
                                    Log.i("StockDetailActivity", "Total Cost: " + totalCost);
                                    Log.i("StockDetailActivity", "Avg Cost: " + avgCost);
                                    break;
                                }
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        setContents();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
                });
        requestQueue.add(request);
    }

    private void updateFavorite(boolean doAdd) {
        if (doAdd) {
//            Map<String, String> params = new HashMap<>();
//            params.put("symbols", stockSymbol);
//            try {
//                params.put("name", companyProfile.getString("name"));
//            } catch (JSONException e) {
//                throw new RuntimeException(e);
//            }
            StringRequest request = new StringRequest(Request.Method.POST, apiURI + "/search/add/" + stockSymbol,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Log.i("StockDetailActivity", "Response from add to watchlist: " + response);
                            isFavorite = true;
                            invalidateOptionsMenu();
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.i("StockDetailActivity", "Error: " + error.getMessage());
                        }
                    }
                    ) {
                @Override
                public byte[] getBody() {
                    JSONObject jsonBody = new JSONObject();
                    try {
                        jsonBody.put("name", companyProfile.getString("name"));
                    } catch (JSONException e) {
                        Log.i("StockDetailActivity", "Error: " + e.getMessage());
                    }
                    return jsonBody.toString().getBytes(StandardCharsets.UTF_8);
                }
                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Content-Type", "application/json");
                    return headers;
                }
            };
            Log.i("StockDetailActivity", "Request: " + request.toString());
            requestQueue.add(request);
        } else {
            StringRequest request = new StringRequest(Request.Method.DELETE, apiURI + "/search/delete/" + stockSymbol,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Log.i("StockDetailActivity", "Response from remove from watchlist: " + response);
                            isFavorite = false;
                            invalidateOptionsMenu();
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.i("StockDetailActivity", "Error: " + error.getMessage());
                        }
                    });
            Log.i("StockDetailActivity", "Request: " + request);
            requestQueue.add(request);
        }
    }

    private void updatePortfolio(double walletBalance, int quantity, double totalCost) {
        this.walletBalance = walletBalance;
        this.quantity = quantity;
        this.totalCost = totalCost;
        if (quantity > 0) {
            StringRequest request = new StringRequest(Request.Method.POST, apiURI + "/portfolio/add/" + stockSymbol,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Log.i("StockDetailActivity", "Response from portfolio add: " + response);
                            updateWallet(walletBalance);
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.i("StockDetailActivity", "Update Portfolio Error: " + error.getMessage());
                        }
                    })
            {
                @Override
                public byte[] getBody() {
                    JSONObject jsonBody = new JSONObject();
                    try {
                        jsonBody.put("name", companyProfile.getString("name"));
                        jsonBody.put("quantity", quantity);
                        jsonBody.put("totalCost", totalCost);
                    } catch (JSONException e) {
                        Log.i("StockDetailActivity", "Error: " + e.getMessage());
                    }
                    return jsonBody.toString().getBytes(StandardCharsets.UTF_8);
                }
                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Content-Type", "application/json");
                    return headers;
                }
            };
            Log.i("StockDetailActivity", "Request: " + request.toString());
            requestQueue.add(request);

        }
        else {
            StringRequest request = new StringRequest(Request.Method.DELETE, apiURI + "/portfolio/delete/" + stockSymbol,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Log.i("StockDetailActivity", "Response from portfolio delete: " + response);
                            updateWallet(walletBalance);
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.i("StockDetailActivity", "Error: " + error.getMessage());
                        }
            });
            Log.i("StockDetailActivity", "Request: " + request);
            requestQueue.add(request);
        }
    }

    private void updateWallet(double walletBalance) {
        StringRequest request = new StringRequest(Request.Method.POST, apiURI + "/wallet/update",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.i("StockDetailActivity", "Response from wallet update: " + response);
                        setPortfolio();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("StockDetailActivity", "Error: " + error.getMessage());
                    }
        })
        {
            @Override
            public byte[] getBody() {
                JSONObject jsonBody = new JSONObject();
                try {
                    jsonBody.put("balance", walletBalance);
                } catch (JSONException e) {
                    Log.i("StockDetailActivity", "Error: " + e.getMessage());
                }
                return jsonBody.toString().getBytes(StandardCharsets.UTF_8);
            }
            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Content-Type", "application/json");
                return headers;
            }
        };
        Log.i("StockDetailActivity", "Request Update Wallet: " + request);
        requestQueue.add(request);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        apiUpdateHandler.removeCallbacks(apiUpdateRunnable);
    }


}