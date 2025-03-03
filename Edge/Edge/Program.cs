using Edge;
using Edge.Adapters;

var mqttClient = new MyMqttClient("host.docker.internal", 1883, "clientId2");
var agent = new AgentAdapter(mqttClient);
var hub = new HubAdapter("http://hub:8080/roadData");
var processor = new DataProcessor(agent, hub);
await processor.Start();
while (true)
{
    await Task.Delay(1000);
}