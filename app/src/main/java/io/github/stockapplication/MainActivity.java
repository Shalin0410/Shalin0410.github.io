package io.github.stockapplication;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
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

public class MainActivity extends AppCompatActivity implements RecyclerViewInterface {
    //TODO: Add Search Suggestions
    //TODO: Add moving item functionality
    
    private ConstraintLayout contentLayout;
    private ProgressBar spinner;
    private TextView cashBalance;
    private TextView netWorth;
    private RecyclerView portfolioRecyclerView;
    private StockAdapter adapter;
    private RecyclerView favoritesRecyclerView;
    private FavoriteStockAdapter favAdapter;
    private String apiURI = "https://assign2shalin.wl.r.appspot.com";
    private double calcNetWorth = 0.0;

    double latestQuote = 0.0;
    double changeInPrice = 0.0;
    double changeInPercent = 0.0;
    ArrayList<Stock> portfolioStocks;
    ArrayList<Stock> favoriteStocks;
    int count = 0;
    int favCount = 0;
    ActionBar actionBar;
    MenuItem searchItem;
    boolean firstTime = true;
    ArrayList<String> suggestions;
    TextView finnHub;
    @SuppressLint("RestrictedApi")
    SearchView.SearchAutoComplete autoComplete;


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
        actionBar = getSupportActionBar();
        actionBar.setTitle("Stocks");

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
        Log.i("myTag", "onCreate");
        if (firstTime) {
            spinner.setVisibility(View.VISIBLE);
        }

        fetchMongoDBData(requestQueue);

//        StockAdapter adapter = new StockAdapter(this, portfolioStocks);
//        portfolioRecyclerView.setAdapter(adapter);
//        portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(this));
//        spinner.setVisibility(View.GONE);
//        contentLayout.setVisibility(View.VISIBLE);
        finnHub = (TextView) findViewById(R.id.finnHub);
        finnHub.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String webURL = "https://finnhub.io";
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(webURL));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        });


    }

    private void fetchMongoDBData(RequestQueue requestQueue) {
        portfolioStocks = new ArrayList<>();
        favoriteStocks = new ArrayList<>();
        count = 0;
        favCount = 0;
        getCashBalanceMongoDB(requestQueue);
        getPortfolioStocksMongoDB(requestQueue);
    }

    private void getCashBalanceMongoDB(RequestQueue requestQueue) {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, apiURI + "/wallet",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        response = response.replace("\"", "");
                        calcNetWorth = calcNetWorth + Double.parseDouble(response);
                        Log.i("myTag", "Cash Balance: " + response);
                        String walletBalance = "$" + String.format("%.2f", calcNetWorth);
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
                            Log.i("myTag", "Portfolio Stocks Inside Loop: " + portfolioStocks);
                        }
                        Log.i("myTag", "Portfolio Stock Out Loop: " + portfolioStocks);
                        if (portfolioStocks.size() > 0) {

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
                                                Log.i("myTag", "Net Worth: " + calcNetWorth);
                                                Log.i("myTag", "Count: " + count + " Size: " + portfolioStocks.size());
                                                if (count == portfolioStocks.size()) {
                                                    adapter = new StockAdapter(MainActivity.this, portfolioStocks, MainActivity.this, "portfolio");
                                                    ItemTouchHelper.Callback callback = new ItemMovePortfolioCallback(adapter);
                                                    ItemTouchHelper touchHelper = new ItemTouchHelper(callback);
                                                    touchHelper.attachToRecyclerView(portfolioRecyclerView);
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
                        } else {
                            adapter = new StockAdapter(MainActivity.this, portfolioStocks, MainActivity.this, "portfolio");
                            portfolioRecyclerView.setAdapter(adapter);
                            portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                            String displayNetWorth = "$" + String.format("%.2f", calcNetWorth);
                            netWorth.setText(displayNetWorth);
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
                                                favAdapter = new FavoriteStockAdapter(MainActivity.this, favoriteStocks, MainActivity.this, "favorite");

                                                ItemTouchHelper.Callback callback = new ItemMoveCallback(favAdapter);
                                                ItemTouchHelper touchHelper = new ItemTouchHelper(callback);
                                                touchHelper.attachToRecyclerView(favoritesRecyclerView);

                                                favoritesRecyclerView.setAdapter(favAdapter);
                                                favoritesRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
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
                        spinner.setVisibility(View.GONE);
                        contentLayout.setVisibility(View.VISIBLE);
                        invalidateOptionsMenu();
                        enableSwipeToDelete(requestQueue);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("myTag", "Error: " + error.getMessage());
            }
        });
        requestQueue.add(request);
    }

    private void enableSwipeToDelete(RequestQueue requestQueue) {
        SwipeToDeleteCallback swipeToDeleteCallback = new SwipeToDeleteCallback(this) {

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int i) {
                final int position = viewHolder.getAdapterPosition();
                final Stock item = favAdapter.getData().get(position);
                favAdapter.removeItem(position);
                Log.i("myTag", "Item Deleted");
                Log.i("myTag", "Symbol: " + item.getSymbol());
                Log.i("myTag", "Favorite Stock: " + favoriteStocks);
                StringRequest stringRequest = new StringRequest(Request.Method.DELETE, apiURI + "/search/delete/" + item.getSymbol(),
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                Log.i("myTag", "Response From Delete MongoDB: " + response);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("myTag", "Error: " + error.getMessage());
                    }
                });
                requestQueue.add(stringRequest);
            }
        };
        ItemTouchHelper itemTouchHelper = new ItemTouchHelper(swipeToDeleteCallback);
        itemTouchHelper.attachToRecyclerView(favoritesRecyclerView);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.action_buttons, menu);
        return true;
    }

    @SuppressLint("RestrictedApi")
    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        super.onPrepareOptionsMenu(menu);
        if (spinner.getVisibility() == View.GONE) {
            getMenuInflater().inflate(R.menu.action_buttons, menu);
            searchItem = menu.findItem(R.id.action_search_icon);
            searchItem.setVisible(true);
            SearchView searchView = (SearchView) searchItem.getActionView();
            autoComplete = searchView.findViewById(androidx.appcompat.R.id.search_src_text);
            autoComplete.setThreshold(0);
            if (autoComplete != null) {
                autoComplete.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        String query = (String) parent.getItemAtPosition(position);
                        String symbol = query.substring(0, query.indexOf(" | "));
                        Log.i("myTag", "Query: " + symbol);
                        Intent intent = new Intent(MainActivity.this, StockDetailActivity.class);
                        intent.putExtra("symbol", symbol);
                        firstTime = false;
                        startActivity(intent);
                    }
                });
                searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                    @Override
                    public boolean onQueryTextSubmit(String query) {
                        String symbol = query.substring(0, query.indexOf(" | "));
                        Log.i("myTag", "Query: " + symbol);
                        Intent intent = new Intent(MainActivity.this, StockDetailActivity.class);
                        intent.putExtra("symbol", symbol);
                        firstTime = false;
                        startActivity(intent);
                        return true;
                    }

                    @Override
                    public boolean onQueryTextChange(String newText) {
                        Log.i("myTag", "onQueryTextChange: " + newText);
                        performSearch(newText, searchView);
                        return true;
                    }
                });
            }
        }
        return true;
    }

    private void performSearch(String query, SearchView searchView) {
        suggestions = new ArrayList<>();
        if (query == null || query.isEmpty()) {
            return; // Return early if the query is empty
        }
        RequestQueue requestSuggestionQueue = Volley.newRequestQueue(this);
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, apiURI + "/search?q=" + query, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.i("myTag", "Response From Search MongoDB: " + response);
                        try {
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject stock = response.getJSONObject(i);
                                String symbol = stock.getString("symbol");
                                String type = stock.getString("type");
                                suggestions.add(symbol + " | " + stock.getString("description"));
                            }
                            Log.i("myTag", "Suggestions: " + suggestions);
                        } catch (JSONException e) {
                            Log.i("myTag", "Error: " + e.getMessage());
                        }
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_dropdown_item_1line, suggestions);
                        autoComplete.setAdapter(adapter);
                        adapter.notifyDataSetChanged();
                    }
                }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.e("myTag", "Volley error: " + error.getMessage());
                }
        });
        requestSuggestionQueue.add(request);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.i("myTag", "onDestroy called");
    }
    @Override
    public void onResume() {
        super.onResume();
        if (!firstTime) {
            Log.i("myTag", "onResume");
            fetchMongoDBData(Volley.newRequestQueue(this));
        }
    }

    @Override
    public void onItemClicked(int position, String tag) {
        Log.i("myTag", "Item Clicked");
        Log.i("myTag", "Tag: " + tag + " Position: " + position);
        Intent intent = new Intent(MainActivity.this, StockDetailActivity.class);
        String symbol = "";
        if (tag.equals("portfolio")) {
            Stock stock = portfolioStocks.get(position);
            symbol = stock.getSymbol();
        } else {
            Stock stock = favoriteStocks.get(position);
            symbol = stock.getSymbol();
        }
        intent.putExtra("symbol", symbol);
        firstTime = false;
        startActivity(intent);
    }
}