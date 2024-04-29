package io.github.stockapplication;

public class Stock {
    private String symbol = "";
    private String name = "";
    private double avgCost = 0;
    private int quantity = 0;
    private double totalCost = 0;
    private double latestQuote = 0;
    private double changeInPrice = 0;
    private double changeInPricePercent = 0;

    public Stock(String symbol, int quantity, double totalCost, double avgCost) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.totalCost = totalCost;
        this.avgCost = avgCost;
        this.latestQuote = 0;
    }
    public Stock(String symbol, String name) {
        this.symbol = symbol;
        this.name = name;
        this.latestQuote = 0;
        this.changeInPrice = 0;
        this.changeInPricePercent = 0;
    }

    public String getSymbol() {
        return symbol;
    }
    public int getQuantity() {
        return quantity;
    }
    public double getTotalCost() {
        return totalCost;
    }
    public double getAvgCost() {
        return avgCost;
    }

    public void setLatestQuote(double latestQuote) {
        this.latestQuote = latestQuote;
    }
    public double getLatestQuote() {
        return latestQuote;
    }


    public double getChangeInPrice() {
        return changeInPrice;
    }

    public void setChangeInPrice(double changeInPrice) {
        this.changeInPrice = changeInPrice;
    }

    public double getChangeInPricePercent() {
        return changeInPricePercent;
    }

    public void setChangeInPricePercent(double changeInPricePercent) {
        this.changeInPricePercent = changeInPricePercent;
    }

    public String getName() {
        return name;
    }
}
