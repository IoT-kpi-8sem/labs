using System.Text.Json;
using Edge.Entities;

namespace Hub.Services;

public class StoreAdapter(string endpoint) : IStoreAdapter
{
    private readonly HttpClient _client = new();

    public async Task Save(IEnumerable<ProcessedAgentData> data)
    {
        Console.WriteLine("Saving");
        var content = new StringContent(JsonSerializer.Serialize(data));
        content.Headers.ContentType = new("application/json");
        await _client.PostAsync(endpoint, content);
    }
}