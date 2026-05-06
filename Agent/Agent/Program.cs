using System.Text.Json;
using Agent.Client;
using Agent.DataReaders;
using Agent.Metrics;
using Prometheus;

var metricServer = new KestrelMetricServer(port: 9100);
metricServer.Start();
Console.WriteLine("Agent metrics on :9100/metrics");

var mqttClient = new MyMqttClient("host.docker.internal", 1883, "clientId");
await mqttClient.ConnectAsync();
AgentMetrics.MqttConnected.Set(1);
Console.WriteLine("Connected!");

var fileReader = new FileDataReader();
fileReader.StartRead();
await foreach (var val in fileReader.Read())
{
    var payload = JsonSerializer.Serialize(val);
    await mqttClient.PublishAsync("agent", payload);
    AgentMetrics.LastSpeed.WithLabels(val.ClientId ?? "unknown").Set(val.Speed);
    AgentMetrics.LastAccelerometerZ.WithLabels(val.ClientId ?? "unknown").Set(val.Accelerometer.Z);
    Console.WriteLine(payload);
    await Task.Delay(1000);
}
fileReader.StopRead();
