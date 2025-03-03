using System.Text;
using System.Text.Json;
using Edge.Entities;

namespace Edge.Adapters;

public class AgentAdapter(MyMqttClient mqttClient)
{
    private readonly MyMqttClient _mqttClient  = mqttClient;

    public async Task StartReading(Func<AgentMessage, Task> handler)
    {
        await mqttClient.ConnectAsync();
        Console.WriteLine("Connected!");

        await mqttClient.SubscribeAsync("agent", e =>
        {
            var message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            return handler(JsonSerializer.Deserialize<AgentMessage>(message));
        });
    }
}