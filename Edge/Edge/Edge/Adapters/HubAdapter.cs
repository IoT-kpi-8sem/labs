using System.Net.Http.Json;
using System.Text.Json;
using Edge.Entities;

namespace Edge.Adapters;

public class HubAdapter(string endpoint)
{
    private readonly HttpClient _client = new();

    public async Task SendData(ProcessedAgentData data)
    {
        Console.WriteLine(data.RoadState);
        var content = new StringContent(JsonSerializer.Serialize(data));
        content.Headers.ContentType = new("application/json");
        await _client.PostAsync(endpoint, content);
    }
}