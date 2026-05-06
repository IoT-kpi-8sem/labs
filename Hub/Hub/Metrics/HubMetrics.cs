using Prometheus;

namespace Hub.Metrics;

public static class HubMetrics
{
    public static readonly Counter RoadDataReceived = Prometheus.Metrics.CreateCounter(
        "hub_road_data_received_total",
        "Road data records received from Edge",
        new CounterConfiguration { LabelNames = new[] { "road_state" } });

    public static readonly Counter StoreCallsTotal = Prometheus.Metrics.CreateCounter(
        "hub_store_calls_total",
        "Calls from Hub to Store API",
        new CounterConfiguration { LabelNames = new[] { "status" } });

    public static readonly Histogram StoreCallDuration = Prometheus.Metrics.CreateHistogram(
        "hub_store_call_duration_seconds",
        "Latency of Hub -> Store HTTP calls",
        new HistogramConfiguration
        {
            LabelNames = new[] { "status" },
            Buckets = Histogram.ExponentialBuckets(0.005, 2, 12)
        });

    public static readonly Histogram BatchSize = Prometheus.Metrics.CreateHistogram(
        "hub_store_batch_size",
        "Number of records per Hub -> Store batch",
        new HistogramConfiguration
        {
            Buckets = new double[] { 1, 2, 5, 10, 20, 50, 100 }
        });
}
