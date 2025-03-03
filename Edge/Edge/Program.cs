using Edge;
using Edge.Adapters;

var mqttClient = new MyMqttClient("127.0.0.1", 1883, "clientId2");
var agent = new AgentAdapter(mqttClient);
var hub = new HubAdapter("http://localhost:5062/roadData");
var processor = new DataProcessor(agent, hub);
await processor.Start();
while (true)
{
    await Task.Delay(1000);
}