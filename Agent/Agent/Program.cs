using System.Text.Json;
using Agent.Client;
using Agent.DataReaders;

var mqttClient = new MyMqttClient("127.0.0.1", 1883, "clientId");
await mqttClient.ConnectAsync();
Console.WriteLine("Connected!");

var fileReader = new FileDataReader();
fileReader.StartRead();
await foreach (var val in fileReader.Read())
{
    await mqttClient.PublishAsync("agent", JsonSerializer.Serialize(val));
    Console.WriteLine(JsonSerializer.Serialize(val));
    await Task.Delay(1000);
}
fileReader.StopRead();

