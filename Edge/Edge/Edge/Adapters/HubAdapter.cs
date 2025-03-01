using System.Text.Json;
using Edge.Entities;

namespace Edge.Adapters;

public class HubAdapter(string host, int port)
{
    public async Task SendData(ProcessedAgentData data)
    {
        Console.WriteLine(data.RoadState);
    }
}