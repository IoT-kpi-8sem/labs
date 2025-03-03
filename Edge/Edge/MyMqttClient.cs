using MQTTnet;

namespace Edge;

public class MyMqttClient(string host, int port, string user)
{
    private readonly IMqttClient _mqttClient = new MqttClientFactory().CreateMqttClient();

    public async Task ConnectAsync()
    {
        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(host, port) 
            .WithClientId(user)
            .Build();
    
        var connectResult = await _mqttClient.ConnectAsync(options);

        if (connectResult.ResultCode != MqttClientConnectResultCode.Success) 
            throw new Exception($"Failed to connect to the MQTT server: {connectResult.ResultCode}");
    }

    public async Task SubscribeAsync(string topic, Func<MqttApplicationMessageReceivedEventArgs, Task> handler)
    {
        _mqttClient.ApplicationMessageReceivedAsync += handler;

        await _mqttClient.SubscribeAsync(topic);
    }
}