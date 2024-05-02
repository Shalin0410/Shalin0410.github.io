package io.github.stockapplication;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import org.json.JSONObject;

import java.util.Date;
import java.util.List;

public class NewsAdapter extends RecyclerView.Adapter<NewsAdapter.MyViewHolder> {
    private final NewsRecyclerViewInterface recyclerViewInterface;
    Context context;
    List<JSONObject> news;

    public NewsAdapter(Context context, List<JSONObject> news, NewsRecyclerViewInterface recyclerViewInterface) {
        this.context = context;
        this.news = news;
        this.recyclerViewInterface = recyclerViewInterface;

    }

    @NonNull
    @Override
    public NewsAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.recycler_view_news, parent, false);
        return new NewsAdapter.MyViewHolder(view, recyclerViewInterface);
    }

    @Override
    public void onBindViewHolder(@NonNull NewsAdapter.MyViewHolder holder, int position) {
        holder.newSource.setText(news.get(position).optString("source"));
        holder.newHeadline.setText(news.get(position).optString("headline"));

        long datetime = news.get(position).optInt("datetime");
        Date pastDate = new Date(datetime * 1000);
        Date currentDate = new Date();
        long hoursPassed = (currentDate.getTime() - pastDate.getTime()) / (60 * 60 * 1000);
        hoursPassed = Math.abs(hoursPassed);
        holder.newsPublishedAt.setText(String.valueOf(hoursPassed) + " hours ago");

        Picasso.get().load(news.get(position).optString("image")).into(holder.imageView);
    }

    @Override
    public int getItemCount() {
        return news.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        ImageView imageView;
        TextView newSource;
        TextView newHeadline;
        TextView newsPublishedAt;


        public MyViewHolder(@NonNull View itemView, NewsRecyclerViewInterface recyclerViewInterface) {
            super(itemView);
            imageView = itemView.findViewById(R.id.imageView);
            newSource = itemView.findViewById(R.id.newsItemSource);
            newHeadline = itemView.findViewById(R.id.firstNewsTitle);
            newsPublishedAt = itemView.findViewById(R.id.firstNewsTime);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (recyclerViewInterface != null){
                        int pos = getAdapterPosition();
                        if (pos != RecyclerView.NO_POSITION){
                            recyclerViewInterface.onNewsItemClick(pos);
                        }
                    }
                }
            });

        }
    }
}
