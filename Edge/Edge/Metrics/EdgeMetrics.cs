using Prometheus;

namespace Edge.Metrics;

public static class EdgeMetrics
{
    public static readonly Counter MessagesProcessed = Prometheus.Metrics.CreateCounter(
        "edge_messages_processed_total",
        "Agent messages processed by Edge",
        new CounterConfiguration { LabelNames = new[] { "road_state" } });

    public static readonly Histogram ProcessingDuration = Prometheus.Metrics.CreateHistogram(
        "edge_processing_duration_seconds",
        "Time to classify a single AgentMessage",
        new HistogramConfiguration
        {
            Buckets = Histogram.ExponentialBuckets(0.0001, 2, 12)
        });

    public static readonly Histogram HubSendDuration = Prometheus.Metrics.CreateHistogram(
        "edge_hub_send_duration_seconds",
        "Latency of Edge -> Hub HTTP calls",
        new HistogramConfiguration
        {
            LabelNames = new[] { "status" },
            Buckets = Histogram.ExponentialBuckets(0.005, 2, 12)
        });

    public static readonly Counter HubSendsTotal = Prometheus.Metrics.CreateCounter(
        "edge_hub_sends_total",
        "Hub send attempts by status",
        new CounterConfiguration { LabelNames = new[] { "status" } });

    public static readonly Gauge LastSpeed = Prometheus.Metrics.CreateGauge(
        "edge_last_speed_kmh",
        "Last observed agent speed (km/h)",
        new GaugeConfiguration { LabelNames = new[] { "client_id" } });
}
