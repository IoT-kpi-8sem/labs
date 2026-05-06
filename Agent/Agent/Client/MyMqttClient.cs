using System.Diagnostics;
using Agent.Metrics;
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
        {
            AgentMetrics.MqttConnected.Set(0);
            throw new Exception($"Failed to connect to the MQTT server: {connectResult.ResultCode}");
        }

        AgentMetrics.MqttConnected.Set(1);
    }

    public async Task PublishAsync(string topic, string payload)
    {
        var message = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithRetainFlag()
            .Build();

        var sw = Stopwatch.StartNew();
        var status = "ok";
        try
        {
            await _mqttClient.PublishAsync(message);
        }
        catch
        {
            status = "error";
            throw;
        }
        finally
        {
            sw.Stop();
            AgentMetrics.PublishDuration.WithLabels(topic).Observe(sw.Elapsed.TotalSeconds);
            AgentMetrics.MessagesPublished.WithLabels(topic, status).Inc();
        }
    }
}
