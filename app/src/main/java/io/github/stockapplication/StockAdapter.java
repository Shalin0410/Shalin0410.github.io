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

public class StockAdapter extends RecyclerView.Adapter<StockAdapter.StockViewHolder> implements ItemMovePortfolioCallback.ItemTouchHelperContract{
    private final RecyclerViewInterface recyclerViewInterface;
    Context context;
    ArrayList<Stock> portfolioList;
    String tag;

    public StockAdapter(Context context, ArrayList<Stock> portfolioList, RecyclerViewInterface recyclerViewInterface, String tag) {
        //Constructor
        this.context = context;
        this.portfolioList = portfolioList;
        this.recyclerViewInterface = recyclerViewInterface;
        this.tag = tag;
    }

    @NonNull
    @Override
    public StockAdapter.StockViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        //This is where you inflate the layout (Giving a look to our rows)
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.recycler_view_portfolio, parent, false);
        return new StockAdapter.StockViewHolder(view, recyclerViewInterface, tag);
    }

    @Override
    public void onBindViewHolder(@NonNull StockAdapter.StockViewHolder holder, int position) {
        //Assigning values to the views we created in the recycler_view_portfolio.xml
        //based on the position of the recycler view
        holder.symbol.setText(portfolioList.get(position).getSymbol());

        double marketVal = portfolioList.get(position).getLatestQuote() * portfolioList.get(position).getQuantity();
        holder.price.setText("$" + String.format("%.2f", marketVal));

        double changeInPrice = (portfolioList.get(position).getLatestQuote() - portfolioList.get(position).getAvgCost()) * portfolioList.get(position).getQuantity();
        double changeInPricePercent = (changeInPrice / (portfolioList.get(position).getAvgCost() * portfolioList.get(position).getQuantity())) * 100;

        String changeInPriceAndPercent = String.format("%.2f", changeInPrice) + " (" + String.format("%.2f", changeInPricePercent) + "%)";
        holder.changeInPrice.setText(changeInPriceAndPercent);

        holder.quantity.setText(String.valueOf(portfolioList.get(position).getQuantity()) + " shares");

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
        // the recycler view needs to know how many items it has
        return portfolioList.size();
    }

    @Override
    public void onRowMoved(int fromPosition, int toPosition) {
        if (fromPosition < toPosition) {
            for (int i = fromPosition; i < toPosition; i++) {
                Collections.swap(portfolioList, i, i + 1);
            }
        } else {
            for (int i = fromPosition; i > toPosition; i--) {
                Collections.swap(portfolioList, i, i - 1);
            }
        }
        notifyItemMoved(fromPosition, toPosition);
    }

    @Override
    public void onRowSelected(StockViewHolder myViewHolder) {
        myViewHolder.itemView.setBackgroundColor(Color.WHITE);
    }

    @Override
    public void onRowClear(StockViewHolder myViewHolder) {
        myViewHolder.itemView.setBackgroundColor(Color.WHITE);
    }


    public static class StockViewHolder extends RecyclerView.ViewHolder {
        //grabbing the views we created in the recycler_view_portfolio.xml
        //Kinda like in the onCreate method
        ImageView postiveOrNegative;
        TextView symbol;
        TextView price;
        TextView changeInPrice;
        TextView quantity;

        public StockViewHolder(@NonNull View itemView, RecyclerViewInterface recyclerViewInterface, String tag) {
            super(itemView);
            //Assigning the views to the variables
            postiveOrNegative = itemView.findViewById(R.id.postiveOrNegative);
            symbol = itemView.findViewById(R.id.symbol);
            price = itemView.findViewById(R.id.price);
            changeInPrice = itemView.findViewById(R.id.changeInPrice);
            quantity = itemView.findViewById(R.id.quantity);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                        if (recyclerViewInterface != null) {
                            int pos = getAdapterPosition();

                            if (pos != RecyclerView.NO_POSITION){
                                recyclerViewInterface.onItemClicked(pos, tag);
                            }
                        }
                }
            });
        }
    }
}
