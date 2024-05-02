package io.github.stockapplication;

import android.content.Context;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;

public class CompanyPeersAdapter extends RecyclerView.Adapter<CompanyPeersAdapter.MyViewHolder>{
    private CompanyPeersRecyclerViewInterface companyPeersRecyclerViewInterface;
    Context context;
    JSONArray peers;

    public CompanyPeersAdapter(Context context, JSONArray peers, CompanyPeersRecyclerViewInterface companyPeersRecyclerViewInterface) {
        this.context = context;
        this.peers = peers;
        this.companyPeersRecyclerViewInterface = companyPeersRecyclerViewInterface;
    }

    @NonNull
    @Override
    public CompanyPeersAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.recycler_view_company_peers, parent, false);
        return new CompanyPeersAdapter.MyViewHolder(view, companyPeersRecyclerViewInterface);
    }

    @Override
    public void onBindViewHolder(@NonNull CompanyPeersAdapter.MyViewHolder holder, int position) {
        String ticker = peers.optString(position) + ", ";
        SpannableString content = new SpannableString(ticker);
        content.setSpan(new UnderlineSpan(), 0, ticker.length()-1, 0);
        holder.name.setText(content);
    }

    @Override
    public int getItemCount() {
        return peers.length();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        TextView name;
        public MyViewHolder(@NonNull View itemView, CompanyPeersRecyclerViewInterface companyPeersRecyclerViewInterface) {
            super(itemView);
            name = itemView.findViewById(R.id.name);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (companyPeersRecyclerViewInterface != null) {
                        int position = getAdapterPosition();
                        if (position != RecyclerView.NO_POSITION) {
                            companyPeersRecyclerViewInterface.onPeersItemClick(position);
                        }
                    }
                }
            });
        }
    }
}
