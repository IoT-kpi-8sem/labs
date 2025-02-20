using MQTTnet;

namespace Agent.Client;

public class MyMqttClient(string host, int port, string user)
{
    private readonly IMqttClient _mqttClient = new MqttClientFactory().CreateMqttClient();
    private string _host = host;
    private int _port = port;
    private string _user = user;

    public async Task ConnectAsync()
    {
        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(_host, _port) 
            .WithClientId(_user)
            .Build();
    
        var connectResult = await _mqttClient.ConnectAsync(options);

        if (connectResult.ResultCode != MqttClientConnectResultCode.Success) 
            throw new Exception($"Failed to connect to the MQTT server: {connectResult.ResultCode}");
    }

    public async Task PublishAsync(string topic, string payload)
    {
        var message = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithRetainFlag()
            .Build();

        await _mqttClient.PublishAsync(message);
    }
}