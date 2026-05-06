using System.Diagnostics;
using System.Text.Json;
using Edge.Entities;
using Hub.Metrics;

namespace Hub.Services;

public class StoreAdapter(string endpoint) : IStoreAdapter
{
    private readonly HttpClient _client = new();

    public async Task Save(IEnumerable<ProcessedAgentData> data)
    {
        var batch = data as ICollection<ProcessedAgentData> ?? data.ToList();
        HubMetrics.BatchSize.Observe(batch.Count);

        Console.WriteLine("Saving");
        var content = new StringContent(JsonSerializer.Serialize(batch));
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
            HubMetrics.StoreCallDuration.WithLabels(status).Observe(sw.Elapsed.TotalSeconds);
            HubMetrics.StoreCallsTotal.WithLabels(status).Inc();
        }
    }
}
