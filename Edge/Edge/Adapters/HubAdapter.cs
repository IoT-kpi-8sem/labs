using System.Diagnostics;
using System.Net.Http.Json;
using System.Text.Json;
using Edge.Entities;
using Edge.Metrics;

namespace Edge.Adapters;

public class HubAdapter(string endpoint)
{
    private readonly HttpClient _client = new();

    public async Task SendData(ProcessedAgentData data)
    {
        Console.WriteLine(data.RoadState);
        var content = new StringContent(JsonSerializer.Serialize(data));
        content.Headers.ContentType = new("application/json");

        var sw = Stopwatch.StartNew();
        var status = "ok";
        try
        {
            var response = await _client.PostAsync(endpoint, content);
            status = response.IsSuccessStatusCode ? "ok" : ((int)response.StatusCode).ToString();
        }
        catch
        {
            status = "error";
            throw;
        }
        finally
        {
            sw.Stop();
            EdgeMetrics.HubSendDuration.WithLabels(status).Observe(sw.Elapsed.TotalSeconds);
            EdgeMetrics.HubSendsTotal.WithLabels(status).Inc();
        }
    }
}
