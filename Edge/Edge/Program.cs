using Edge;
using Edge.Adapters;
using Prometheus;

var metricServer = new KestrelMetricServer(port: 9100);
metricServer.Start();
Console.WriteLine("Edge metrics on :9100/metrics");

var mqttClient = new MyMqttClient("host.docker.internal", 1883, "clientId2");
var agent = new AgentAdapter(mqttClient);
var hub = new HubAdapter("http://hub:8080/roadData");
var processor = new DataProcessor(agent, hub);
await processor.Start();
while (true)
{
    await Task.Delay(1000);
}
