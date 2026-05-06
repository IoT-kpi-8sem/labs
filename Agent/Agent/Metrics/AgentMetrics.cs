using Prometheus;

namespace Agent.Metrics;

public static class AgentMetrics
{
    public static readonly Counter MessagesPublished = Prometheus.Metrics.CreateCounter(
        "agent_messages_published_total",
        "Messages published to MQTT",
        new CounterConfiguration { LabelNames = new[] { "topic", "status" } });

    public static readonly Histogram PublishDuration = Prometheus.Metrics.CreateHistogram(
        "agent_publish_duration_seconds",
        "Latency of MQTT publishes",
        new HistogramConfiguration
        {
            LabelNames = new[] { "topic" },
            Buckets = Histogram.ExponentialBuckets(0.0005, 2, 12)
        });

    public static readonly Gauge LastSpeed = Prometheus.Metrics.CreateGauge(
        "agent_last_speed_kmh",
        "Last published agent speed (km/h)",
        new GaugeConfiguration { LabelNames = new[] { "client_id" } });

    public static readonly Gauge LastAccelerometerZ = Prometheus.Metrics.CreateGauge(
        "agent_last_accelerometer_z",
        "Last published accelerometer Z component",
        new GaugeConfiguration { LabelNames = new[] { "client_id" } });

    public static readonly Gauge MqttConnected = Prometheus.Metrics.CreateGauge(
        "agent_mqtt_connected",
        "1 if connected to MQTT broker, 0 otherwise");
}
