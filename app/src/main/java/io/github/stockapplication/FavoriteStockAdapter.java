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
import java.util.Collections;

public class FavoriteStockAdapter extends RecyclerView.Adapter<FavoriteStockAdapter.FavoriteStockViewHolder> implements ItemMoveCallback.ItemTouchHelperContract {
    private final RecyclerViewInterface recyclerViewInterface;
    Context context;
    ArrayList<Stock> favoriteList;
    String tag;

    public FavoriteStockAdapter(Context context, ArrayList<Stock> favoriteList, RecyclerViewInterface recyclerViewInterface, String tag) {
        this.context = context;
        this.favoriteList = favoriteList;
        this.recyclerViewInterface = recyclerViewInterface;
        this.tag = tag;

    }

    @NonNull
    @Override
    public FavoriteStockAdapter.FavoriteStockViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.recycler_view_favorite, parent, false);
        return new FavoriteStockAdapter.FavoriteStockViewHolder(view, recyclerViewInterface, tag);
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
        else if (changeInPricePercent < 0) {
            holder.postiveOrNegative.setImageResource(R.drawable.trending_down);
            holder.changeInPrice.setTextColor(Color.RED);
        } else {
            holder.postiveOrNegative.setImageResource(android.R.color.transparent);
            holder.changeInPrice.setTextColor(Color.BLACK);
        }
    }

    @Override
    public int getItemCount() {
        return favoriteList.size();
    }

    public void removeItem(int position) {
        favoriteList.remove(position);
        notifyItemRemoved(position);
    }

    public ArrayList<Stock> getData() {
        return favoriteList;
    }

    @Override
    public void onRowMoved(int fromPosition, int toPosition) {
        if (fromPosition < toPosition) {
            for (int i = fromPosition; i < toPosition; i++) {
                Collections.swap(favoriteList, i, i + 1);
            }
        } else {
            for (int i = fromPosition; i > toPosition; i--) {
                Collections.swap(favoriteList, i, i - 1);
            }
        }
        notifyItemMoved(fromPosition, toPosition);
    }

    @Override
    public void onRowSelected(FavoriteStockViewHolder myViewHolder) {
        myViewHolder.itemView.setBackgroundColor(Color.WHITE);
    }

    @Override
    public void onRowClear(FavoriteStockViewHolder myViewHolder) {
        myViewHolder.itemView.setBackgroundColor(Color.WHITE);
    }


    public static class FavoriteStockViewHolder extends RecyclerView.ViewHolder {
        ImageView postiveOrNegative;
        TextView symbol;
        TextView price;
        TextView changeInPrice;
        TextView name;
        public FavoriteStockViewHolder(@NonNull View itemView, RecyclerViewInterface recyclerViewInterface, String tag) {
            super(itemView);
            postiveOrNegative = itemView.findViewById(R.id.postiveOrNegative);
            symbol = itemView.findViewById(R.id.symbol);
            price = itemView.findViewById(R.id.price);
            changeInPrice = itemView.findViewById(R.id.changeInPrice);
            name = itemView.findViewById(R.id.name);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (recyclerViewInterface != null) {
                        int pos = getAdapterPosition();

                        if (pos != RecyclerView.NO_POSITION) {
                            recyclerViewInterface.onItemClicked(pos, tag);
                        }
                    }
                }
            });
        }
    }
}
