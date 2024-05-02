package io.github.stockapplication;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class ViewPagerAdapter extends FragmentStateAdapter {
    String symbol;
    public ViewPagerAdapter(@NonNull FragmentActivity fragmentActivity, String symbol) {
        super(fragmentActivity);
        this.symbol = symbol;
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position){
            case 0:
                return new HourlyChartFragment(symbol);
            case 1:
                return new HistoricalChartFragment(symbol);
            default:
                return new HourlyChartFragment(symbol);
        }
    }

    @Override
    public int getItemCount() {
        return 2;
    }
}
