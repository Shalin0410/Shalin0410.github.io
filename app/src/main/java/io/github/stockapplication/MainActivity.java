package io.github.stockapplication;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class MainActivity extends AppCompatActivity {
    
    private ConstraintLayout contentLayout;
    private ProgressBar spinner;
    private TextView cashBalance;
    private TextView netWorth;
    private RecyclerView portfolioRecyclerView;
    private RecyclerView favoritesRecyclerView;
    private String apiURI = "https://assign2shalin.wl.r.appspot.com";
    private double calcNetWorth = 0;

    double latestQuote = 0.0;
    double changeInPrice = 0.0;
    double changeInPercent = 0.0;
    ArrayList<Stock> portfolioStocks;
    ArrayList<Stock> favoriteStocks;
    int count = 0;
    int favCount = 0;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Stocks");
        RequestQueue requestQueue = Volley.newRequestQueue(this);

        spinner = (ProgressBar) findViewById(R.id.progressBar);
        spinner.setVisibility(View.GONE);
        contentLayout = (ConstraintLayout) findViewById(R.id.contentLayout);
        contentLayout.setVisibility(View.GONE);
        TextView currentDate = (TextView) findViewById(R.id.currentDate);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
        String formattedDate = dateFormat.format(new Date());
        currentDate.setText(formattedDate);

        cashBalance = (TextView) findViewById(R.id.cashBal);
        netWorth = (TextView) findViewById(R.id.netWorth);
        portfolioRecyclerView = (RecyclerView) findViewById(R.id.portfolioRecyclerView);
        favoritesRecyclerView = (RecyclerView) findViewById(R.id.favoritesRecyclerView);
        portfolioStocks = new ArrayList<>();
        favoriteStocks = new ArrayList<>();
        count = 0;
        favCount = 0;

        fetchMongoDBData(requestQueue);

//        StockAdapter adapter = new StockAdapter(this, portfolioStocks);
//        portfolioRecyclerView.setAdapter(adapter);
//        portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(this));
//        spinner.setVisibility(View.GONE);
//        contentLayout.setVisibility(View.VISIBLE);
    }

    private void fetchMongoDBData(RequestQueue requestQueue) {
        spinner.setVisibility(View.VISIBLE);

        getCashBalanceMongoDB(requestQueue);
        getPortfolioStocksMongoDB(requestQueue);

        //favouritesRecyclerView.setAdapter(new StockAdapter(favouritesStocks));
    }

    private void getCashBalanceMongoDB(RequestQueue requestQueue) {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, apiURI + "/wallet",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        response = response.replace("\"", "");
                        calcNetWorth = Double.parseDouble(response);
                        Log.i("myTag", "Cash Balance: " + response);
                        String walletBalance = "$" + response;
                        cashBalance.setText(walletBalance);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("myTag", "Error: " + error.getMessage());
            }
        });
        requestQueue.add(stringRequest);
    }

    private void getPortfolioStocksMongoDB(RequestQueue requestQueue) {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/portfolio", null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("myTag", "Response From Portfolio MongoDB: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                Log.i("myTag", "Individial DB Stock: " + response.getJSONObject(i));
                                JSONObject stock = response.getJSONObject(i);
                                String symbol = stock.getString("symbols");
                                int quantity = stock.getInt("quantity");
                                double totalCost = Double.parseDouble(stock.getString("totalCost"));
                                double avgCost = Double.parseDouble(stock.getString("avgCost"));
                                portfolioStocks.add(new Stock(symbol, quantity, totalCost, avgCost));
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        for (Stock stock : portfolioStocks) {
                            JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/quote/" + stock.getSymbol(), null,
                                    new Response.Listener<JSONObject>() {
                                        @Override
                                        public void onResponse(JSONObject response) {
                                            count++;
                                            Log.i("myTag", "Company Quote: " + response);
                                            try {
                                                latestQuote = response.getDouble("c");
                                                stock.setLatestQuote(latestQuote);
                                                calcNetWorth += (latestQuote * stock.getQuantity());
                                            } catch (JSONException e) {
                                                throw new RuntimeException(e);
                                            }
                                            if (count == portfolioStocks.size()) {
                                                StockAdapter adapter = new StockAdapter(MainActivity.this, portfolioStocks);
                                                portfolioRecyclerView.setAdapter(adapter);
                                                portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                                                String displayNetWorth = "$" + String.format("%.2f", calcNetWorth);
                                                netWorth.setText(displayNetWorth);
                                            }
                                        }
                                        }, new Response.ErrorListener() {
                                        @Override
                                        public void onErrorResponse(VolleyError error) {
                                            Log.i("myTag", "Error: " + error.getMessage());
                                        }
                            });
                            requestQueue.add(request);
                        }
                        getFavouritesStocksMongoDB(requestQueue);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("myTag", "Error: " + error.getMessage());
            }
        });
        requestQueue.add(request);
    }

    private void getFavouritesStocksMongoDB(RequestQueue requestQueue) {
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/watchlist", null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("myTag", "Response From Watchlist MongoDB: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                Log.i("myTag", "Individial DB Wathclist Stock: " + response.getJSONObject(i));
                                JSONObject stock = response.getJSONObject(i);
                                String symbol = stock.getString("symbols");
                                String name = stock.getString("name");
                                favoriteStocks.add(new Stock(symbol, name));
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        for (Stock stock : favoriteStocks) {
                            JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiURI + "/quote/" + stock.getSymbol(), null,
                                    new Response.Listener<JSONObject>() {
                                        @Override
                                        public void onResponse(JSONObject response) {
                                            favCount++;
                                            Log.i("myTag", "Company Quote: " + response);
                                            try {
                                                latestQuote = response.getDouble("c");
                                                stock.setLatestQuote(latestQuote);
                                                changeInPrice = response.getDouble("d");
                                                stock.setChangeInPrice(changeInPrice);
                                                changeInPercent = response.getDouble("dp");
                                                stock.setChangeInPricePercent(changeInPercent);
                                            } catch (JSONException e) {
                                                throw new RuntimeException(e);
                                            }
                                            if (favCount == favoriteStocks.size()) {
                                                FavoriteStockAdapter adapter = new FavoriteStockAdapter(MainActivity.this, favoriteStocks);
                                                favoritesRecyclerView.setAdapter(adapter);
                                                favoritesRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                                                spinner.setVisibility(View.GONE);
                                                contentLayout.setVisibility(View.VISIBLE);
                                            }
                                        }
                                    }, new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    Log.i("myTag", "Error: " + error.getMessage());
                                }
                            });
                            requestQueue.add(request);
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("myTag", "Error: " + error.getMessage());
            }
        });
        requestQueue.add(request);
    }
}