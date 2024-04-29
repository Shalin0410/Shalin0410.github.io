package io.github.stockapplication;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class FavoriteStockAdapter extends RecyclerView.Adapter<FavoriteStockAdapter.FavoriteStockViewHolder> {
    Context context;
    ArrayList<Stock> favoriteList;

    public FavoriteStockAdapter(Context context, ArrayList<Stock> favoriteList) {
        this.context = context;
        this.favoriteList = favoriteList;
    }

    @NonNull
    @Override
    public FavoriteStockAdapter.FavoriteStockViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.recycler_view_favorite, parent, false);
        return new FavoriteStockAdapter.FavoriteStockViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FavoriteStockAdapter.FavoriteStockViewHolder holder, int position) {
        holder.symbol.setText(favoriteList.get(position).getSymbol());

        double currentPrice = favoriteList.get(position).getLatestQuote();
        holder.price.setText("$" + String.format("%.2f", currentPrice));

        double changeInPrice = favoriteList.get(position).getChangeInPrice();
        double changeInPricePercent = favoriteList.get(position).getChangeInPricePercent();

        String changeInPriceAndPercent = String.format("%.2f", changeInPrice) + " (" + String.format("%.2f", changeInPricePercent) + "%)";
        holder.changeInPrice.setText(changeInPriceAndPercent);

        holder.name.setText(favoriteList.get(position).getName());

        //Setting the image based on the change in price
        if (changeInPricePercent > 0) {
            holder.postiveOrNegative.setImageResource(R.drawable.trending_up);
            holder.changeInPrice.setTextColor(Color.GREEN);
        }
        else {
            holder.postiveOrNegative.setImageResource(R.drawable.trending_down);
            holder.changeInPrice.setTextColor(Color.RED);
        }
    }

    @Override
    public int getItemCount() {
        return favoriteList.size();
    }

    public static class FavoriteStockViewHolder extends RecyclerView.ViewHolder {
        ImageView postiveOrNegative;
        TextView symbol;
        TextView price;
        TextView changeInPrice;
        TextView name;
        public FavoriteStockViewHolder(@NonNull View itemView) {
            super(itemView);
            postiveOrNegative = itemView.findViewById(R.id.postiveOrNegative);
            symbol = itemView.findViewById(R.id.symbol);
            price = itemView.findViewById(R.id.price);
            changeInPrice = itemView.findViewById(R.id.changeInPrice);
            name = itemView.findViewById(R.id.name);
        }
    }
}
